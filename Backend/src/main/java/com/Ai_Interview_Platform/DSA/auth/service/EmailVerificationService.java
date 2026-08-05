package com.Ai_Interview_Platform.DSA.auth.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import javax.naming.directory.Attribute;
import javax.naming.directory.Attributes;
import javax.naming.directory.DirContext;
import javax.naming.directory.InitialDirContext;
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.InetSocketAddress;
import java.net.Socket;
import java.security.SecureRandom;
import java.time.Instant;
import java.util.Hashtable;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailVerificationService {

    /** OTP validity window in minutes */
    private static final long OTP_EXPIRY_MINUTES = 10;

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Value("${spring.mail.username:}")
    private String fromAddress;

    /** In-memory store: email → (otp, expiry instant) */
    private final Map<String, OtpEntry> otpStorage = new ConcurrentHashMap<>();
    private final SecureRandom random = new SecureRandom();

    // ─────────────────────────────────────────────────────────────────────────
    // Public API
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Validates that the email mailbox actually exists (DNS + SMTP probe),
     * generates a 6-digit OTP, stores it with a 10-minute expiry, and sends
     * a confirmation email. Throws {@link IllegalArgumentException} if the
     * mailbox is not reachable or the email fails to send.
     *
     * @return the generated OTP string (useful for testing when mail is off)
     */
    public String generateAndSendOTP(String email) {
        String sanitized = sanitize(email);

        // 1. Live mailbox existence check
        if (!verifyMailboxExists(sanitized)) {
            log.warn("OTP rejected — non-existent mailbox: {}", sanitized);
            throw new IllegalArgumentException(
                    "The email address '" + sanitized + "' does not exist or cannot receive messages. " +
                    "Please enter a valid, real email address."
            );
        }

        // 2. Generate and store OTP with expiry
        String otp = generateOtp();
        otpStorage.put(sanitized, new OtpEntry(otp, Instant.now().plusSeconds(OTP_EXPIRY_MINUTES * 60)));

        // 3. Send email
        sendOtpEmail(sanitized, otp);

        return otp;
    }

    /**
     * Verifies the OTP the user entered. Returns true if correct and not
     * expired, and removes it from storage (one-time use). Returns false
     * if the OTP is wrong, expired, or was never issued.
     */
    public boolean verifyOTP(String email, String inputOtp) {
        String sanitized = sanitize(email);
        OtpEntry entry = otpStorage.get(sanitized);

        if (entry == null) {
            log.warn("OTP verification attempted but no OTP found for: {}", sanitized);
            return false;
        }

        if (Instant.now().isAfter(entry.expiresAt())) {
            otpStorage.remove(sanitized);
            log.warn("OTP expired for: {}", sanitized);
            return false;
        }

        if (!entry.otp().equals(inputOtp)) {
            log.warn("OTP mismatch for: {}", sanitized);
            return false;
        }

        // Correct and valid — consume it
        otpStorage.remove(sanitized);
        log.info("OTP verified successfully for: {}", sanitized);
        return true;
    }

    /**
     * Returns whether an OTP is currently pending (and not expired) for the
     * given email. Useful for resend-cooldown checks.
     */
    public boolean hasPendingOtp(String email) {
        OtpEntry entry = otpStorage.get(sanitize(email));
        return entry != null && Instant.now().isBefore(entry.expiresAt());
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Mailbox Verification (DNS MX + SMTP probe)
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Performs a live DNS MX lookup and SMTP RCPT TO probe to verify if the
     * email mailbox actually exists.
     */
    public boolean verifyMailboxExists(String email) {
        if (email == null || !email.contains("@")) return false;

        int atIndex = email.indexOf('@');
        String username = email.substring(0, atIndex).trim();
        String domain = email.substring(atIndex + 1).trim().toLowerCase();

        if (username.length() < 2 || domain.length() < 3) return false;

        // Block obvious fake/placeholder domains
        if (domain.equals("test.com") || domain.equals("example.com")
                || domain.equals("fake.com") || domain.equals("abc.com")
                || domain.equals("temp.com") || domain.equals("mailinator.com")) {
            return false;
        }

        try {
            // Step A: DNS MX Record Lookup
            Hashtable<String, String> env = new Hashtable<>();
            env.put("java.naming.factory.initial", "com.sun.jndi.dns.DnsContextFactory");
            DirContext ictx = new InitialDirContext(env);
            Attributes attrs = ictx.getAttributes(domain, new String[]{"MX"});
            Attribute attr = attrs.get("MX");

            if (attr == null || attr.size() == 0) {
                // Fallback: check A record
                attrs = ictx.getAttributes(domain, new String[]{"A"});
                attr = attrs.get("A");
                if (attr == null || attr.size() == 0) {
                    return false;
                }
            }

            String mxHost = null;
            if (attr != null && attr.size() > 0) {
                String firstMx = attr.get(0).toString();
                String[] parts = firstMx.split(" ");
                mxHost = parts.length > 1 ? parts[1] : parts[0];
                if (mxHost.endsWith(".")) mxHost = mxHost.substring(0, mxHost.length() - 1);
            }

            if (mxHost == null || mxHost.isBlank()) return false;

            // Step B: Live SMTP Handshake Probe (RCPT TO) on port 25
            return probeSmtpMailbox(mxHost, email);

        } catch (Exception e) {
            log.debug("Mailbox verification probe exception for {}: {}", email, e.getMessage());
            return false;
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Private helpers
    // ─────────────────────────────────────────────────────────────────────────

    private String generateOtp() {
        return String.format("%06d", random.nextInt(1_000_000));
    }

    private String sanitize(String email) {
        return email == null ? "" : email.trim().toLowerCase();
    }

    private void sendOtpEmail(String email, String otp) {
        if (mailSender == null) {
            log.info("JavaMailSender not configured. OTP for {} (dev only): {}", email, otp);
            return;
        }
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            if (fromAddress != null && !fromAddress.isBlank()) {
                message.setFrom(fromAddress);
            }
            message.setTo(email);
            message.setSubject("AI Interview Platform — Your verification code");
            message.setText(
                    "Welcome to AI Interview Platform!\n\n" +
                    "Your 6-digit email verification code is:\n\n" +
                    "  " + otp + "\n\n" +
                    "This code expires in " + OTP_EXPIRY_MINUTES + " minutes.\n" +
                    "If you did not request this, you can safely ignore this email.\n\n" +
                    "— The AI Interview Platform Team"
            );
            mailSender.send(message);
            log.info("OTP email sent to {}", email);
        } catch (Exception e) {
            log.error("Failed to send OTP email to {}: {}", email, e.getMessage());
            throw new IllegalArgumentException(
                    "Unable to deliver a verification email to '" + email + "'. " +
                    "Please check the address and try again."
            );
        }
    }

    private boolean probeSmtpMailbox(String mxHost, String email) {
        try (Socket socket = new Socket()) {
            socket.connect(new InetSocketAddress(mxHost, 25), 3500);
            BufferedReader reader = new BufferedReader(new InputStreamReader(socket.getInputStream()));
            BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(socket.getOutputStream()));

            String response = reader.readLine();
            if (response == null || !response.startsWith("220")) {
                return true; // Connected — non-standard banner, allow through
            }

            writer.write("HELO ai-interview-platform.com\r\n"); writer.flush();
            reader.readLine();

            writer.write("MAIL FROM:<verify@ai-interview-platform.com>\r\n"); writer.flush();
            reader.readLine();

            writer.write("RCPT TO:<" + email + ">\r\n"); writer.flush();
            response = reader.readLine();

            writer.write("QUIT\r\n"); writer.flush();

            if (response != null &&
                    (response.startsWith("550") || response.startsWith("551")
                            || response.startsWith("553") || response.startsWith("501"))) {
                log.warn("SMTP server {} rejected address {}: {}", mxHost, email, response);
                return false;
            }
            return true;
        } catch (Exception e) {
            // Port 25 may be blocked by ISP — if MX record exists, allow through
            log.debug("SMTP port 25 probe skipped for {}: {}", mxHost, e.getMessage());
            return true;
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Inner record — OTP entry with expiry
    // ─────────────────────────────────────────────────────────────────────────

    private record OtpEntry(String otp, Instant expiresAt) {}
}

package com.Ai_Interview_Platform.DSA.auth.controller;

import com.Ai_Interview_Platform.DSA.auth.dto.LoginRequestDTO;
import com.Ai_Interview_Platform.DSA.auth.dto.LoginResponseDTO;
import com.Ai_Interview_Platform.DSA.auth.dto.RegisterRequestDTO;
import com.Ai_Interview_Platform.DSA.auth.dto.RegisterResponseDTO;
import com.Ai_Interview_Platform.DSA.auth.dto.SendOtpRequestDTO;
import com.Ai_Interview_Platform.DSA.auth.service.EmailVerificationService;
import com.Ai_Interview_Platform.DSA.user.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final UserService userService;
    private final EmailVerificationService emailVerificationService;

    /**
     * Step 1 of registration: validate email and send OTP.
     * Does NOT create the user account.
     *
     * POST /api/auth/send-otp
     * Body: { "email": "user@example.com" }
     */
    @PostMapping("/send-otp")
    public ResponseEntity<Map<String, String>> sendOtp(
            @Valid @RequestBody SendOtpRequestDTO request
    ) {
        emailVerificationService.generateAndSendOTP(request.getEmail());
        return ResponseEntity.ok(Map.of(
                "message", "A 6-digit verification code has been sent to " + request.getEmail()
        ));
    }

    /**
     * Step 2 of registration: verify OTP and create account.
     * Body must include the otp field from the verification screen.
     *
     * POST /api/auth/register
     * Body: { "fullName", "email", "password", "otp" }
     */
    @PostMapping("/register")
    public ResponseEntity<RegisterResponseDTO> register(
            @Valid @RequestBody RegisterRequestDTO request
    ) {
        return new ResponseEntity<>(userService.register(request), HttpStatus.CREATED);
    }

    /**
     * POST /api/auth/login
     */
    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(
            @Valid @RequestBody LoginRequestDTO request
    ) {
        return new ResponseEntity<>(userService.login(request), HttpStatus.OK);
    }
}

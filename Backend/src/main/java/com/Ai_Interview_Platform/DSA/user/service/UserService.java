package com.Ai_Interview_Platform.DSA.user.service;

import com.Ai_Interview_Platform.DSA.auth.dto.LoginRequestDTO;
import com.Ai_Interview_Platform.DSA.auth.dto.LoginResponseDTO;
import com.Ai_Interview_Platform.DSA.auth.dto.RegisterRequestDTO;
import com.Ai_Interview_Platform.DSA.auth.dto.RegisterResponseDTO;
import com.Ai_Interview_Platform.DSA.auth.exception.EmailAlreadyExistsException;
import com.Ai_Interview_Platform.DSA.auth.exception.OtpVerificationException;
import com.Ai_Interview_Platform.DSA.auth.jwt.CustomUserDetailsService;
import com.Ai_Interview_Platform.DSA.auth.jwt.JwtService;
import com.Ai_Interview_Platform.DSA.auth.service.EmailVerificationService;
import com.Ai_Interview_Platform.DSA.common.enums.Role;
import com.Ai_Interview_Platform.DSA.user.dto.UserProfileResponseDTO;
import com.Ai_Interview_Platform.DSA.user.entity.User;
import com.Ai_Interview_Platform.DSA.user.mapper.UserMapper;
import com.Ai_Interview_Platform.DSA.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final CustomUserDetailsService customUserDetailsService;
    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final EmailVerificationService emailVerificationService;

    /**
     * Completes registration. The caller must have already gone through the
     * send-OTP step — this method verifies the OTP before creating the account.
     */
    public RegisterResponseDTO register(RegisterRequestDTO request) {
        // 1. Reject duplicate emails
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyExistsException("An account with this email already exists.");
        }

        // 2. Verify the OTP the user entered against the stored one
        boolean valid = emailVerificationService.verifyOTP(
                request.getEmail().trim().toLowerCase(),
                request.getOtp()
        );
        if (!valid) {
            throw new OtpVerificationException(
                    "The verification code is incorrect or has expired. " +
                    "Please request a new code and try again."
            );
        }

        // 3. OTP correct — create and save the account
        User user = userMapper.toEntity(request);
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole(Role.USER);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());

        User savedUser = userRepository.save(user);
        log.info("Account created for verified user: {}", savedUser.getEmail());
        return userMapper.toResponse(savedUser);
    }

    public LoginResponseDTO login(LoginRequestDTO request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        UserDetails userDetails = customUserDetailsService.loadUserByUsername(request.getEmail());
        String token = jwtService.generateToken(userDetails);
        return new LoginResponseDTO(token);
    }

    public UserProfileResponseDTO getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        User user = userRepository.findByEmail(email).orElseThrow(
                () -> new UsernameNotFoundException("Email not found"));
        return userMapper.toUserProfileResponse(user);
    }
}

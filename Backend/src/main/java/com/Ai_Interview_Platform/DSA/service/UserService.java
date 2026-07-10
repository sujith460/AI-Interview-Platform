package com.Ai_Interview_Platform.DSA.service;

import com.Ai_Interview_Platform.DSA.dto.auth.LoginRequestDTO;
import com.Ai_Interview_Platform.DSA.dto.auth.LoginResponseDTO;
import com.Ai_Interview_Platform.DSA.dto.auth.RegisterRequestDTO;
import com.Ai_Interview_Platform.DSA.dto.auth.RegisterResponseDTO;
import com.Ai_Interview_Platform.DSA.dto.user.UserProfileResponseDTO;
import com.Ai_Interview_Platform.DSA.entity.User;
import com.Ai_Interview_Platform.DSA.entity.enums.Role;
import com.Ai_Interview_Platform.DSA.exception.EmailAlreadyExistsException;
import com.Ai_Interview_Platform.DSA.mapper.UserMapper;
import com.Ai_Interview_Platform.DSA.repository.UserRepository;
import com.Ai_Interview_Platform.DSA.security.CustomUserDetailsService;
import com.Ai_Interview_Platform.DSA.security.JwtService;
import lombok.RequiredArgsConstructor;
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
public class UserService {

    private final CustomUserDetailsService customUserDetailsService;

    private final JwtService jwtService;

    private final UserRepository userRepository;

    private final UserMapper userMapper;

    private final PasswordEncoder passwordEncoder;

    private final AuthenticationManager authenticationManager;

    public RegisterResponseDTO register(RegisterRequestDTO request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyExistsException(
                    "Email already exists"
            );
        }
        User user = userMapper.toEntity(request);

        user.setPassword(passwordEncoder.encode(user.getPassword()));

        user.setRole(Role.USER);

        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());


        User savedUser = userRepository.save(user);

        return userMapper.toResponse(savedUser);
    }

    public LoginResponseDTO  login(LoginRequestDTO request) {
        authenticationManager.authenticate(

                new UsernamePasswordAuthenticationToken(

                        request.getEmail(),
                        request.getPassword()

                )
        );
        UserDetails userDetails =
                customUserDetailsService.loadUserByUsername(
                        request.getEmail()
                );
        String token =
                jwtService.generateToken(userDetails);
        return new LoginResponseDTO(
                token
        );
    }

    public UserProfileResponseDTO getCurrentUser() {
        Authentication authentication= SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        User user=userRepository.findByEmail(email).orElseThrow(
                () -> new UsernameNotFoundException("Email not found"));
        return userMapper.toUserProfileResponse(user);
    }
}

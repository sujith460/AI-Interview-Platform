package com.Ai_Interview_Platform.DSA.service;

import com.Ai_Interview_Platform.DSA.dto.auth.RegisterRequestDTO;
import com.Ai_Interview_Platform.DSA.dto.auth.RegisterResponseDTO;
import com.Ai_Interview_Platform.DSA.entity.User;
import com.Ai_Interview_Platform.DSA.entity.enums.Role;
import com.Ai_Interview_Platform.DSA.exception.EmailAlreadyExistsException;
import com.Ai_Interview_Platform.DSA.mapper.UserMapper;
import com.Ai_Interview_Platform.DSA.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    private final UserMapper userMapper;

    private final PasswordEncoder passwordEncoder;

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

}

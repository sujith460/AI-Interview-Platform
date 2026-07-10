package com.Ai_Interview_Platform.DSA.service;

import com.Ai_Interview_Platform.DSA.dto.profile.ProfileResponseDTO;
import com.Ai_Interview_Platform.DSA.dto.profile.ProfileUpdateRequestDTO;
import com.Ai_Interview_Platform.DSA.entity.User;
import com.Ai_Interview_Platform.DSA.mapper.UserMapper;
import com.Ai_Interview_Platform.DSA.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final UserRepository userRepository;

    private final UserMapper userMapper;

    public ProfileResponseDTO getProfile() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UsernameNotFoundException("User not found"));

        return userMapper.toProfileResponse(user);
    }

    public ProfileResponseDTO updateProfile(ProfileUpdateRequestDTO request) {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UsernameNotFoundException("User not found"));

        userMapper.updateProfileFromDto(request, user);

        User updatedUser = userRepository.save(user);

        return userMapper.toProfileResponse(updatedUser);
    }
}
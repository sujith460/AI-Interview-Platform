package com.Ai_Interview_Platform.DSA.user.controller;

import com.Ai_Interview_Platform.DSA.user.dto.ProfileResponseDTO;
import com.Ai_Interview_Platform.DSA.user.dto.ProfileUpdateRequestDTO;
import com.Ai_Interview_Platform.DSA.user.service.ProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;

    @GetMapping
    public ProfileResponseDTO getProfile() {
        return profileService.getProfile();
    }

    @PutMapping
    public ProfileResponseDTO updateProfile(
            @Valid @RequestBody ProfileUpdateRequestDTO request
    ) {
        return profileService.updateProfile(request);
    }
}

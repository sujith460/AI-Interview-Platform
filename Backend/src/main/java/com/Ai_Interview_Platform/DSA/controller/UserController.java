package com.Ai_Interview_Platform.DSA.controller;

import com.Ai_Interview_Platform.DSA.dto.user.UserProfileResponseDTO;
import com.Ai_Interview_Platform.DSA.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public UserProfileResponseDTO getCurrentUser() {
        return userService.getCurrentUser();
    }
}
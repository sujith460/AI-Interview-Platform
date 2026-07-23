package com.Ai_Interview_Platform.DSA.user.controller;

import com.Ai_Interview_Platform.DSA.user.dto.UserProfileResponseDTO;
import com.Ai_Interview_Platform.DSA.user.service.UserService;
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

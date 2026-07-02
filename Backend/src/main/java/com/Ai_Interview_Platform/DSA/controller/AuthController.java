package com.Ai_Interview_Platform.DSA.controller;

import com.Ai_Interview_Platform.DSA.dto.auth.RegisterRequestDTO;
import com.Ai_Interview_Platform.DSA.dto.auth.RegisterResponseDTO;
import com.Ai_Interview_Platform.DSA.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;

    @PostMapping("/register")
    public RegisterResponseDTO register(@Valid @RequestBody RegisterRequestDTO request) {
        return userService.register(request);
    }
}
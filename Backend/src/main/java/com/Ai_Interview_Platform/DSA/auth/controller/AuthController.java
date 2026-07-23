package com.Ai_Interview_Platform.DSA.auth.controller;

import com.Ai_Interview_Platform.DSA.auth.dto.LoginRequestDTO;
import com.Ai_Interview_Platform.DSA.auth.dto.LoginResponseDTO;
import com.Ai_Interview_Platform.DSA.auth.dto.RegisterRequestDTO;
import com.Ai_Interview_Platform.DSA.auth.dto.RegisterResponseDTO;
import com.Ai_Interview_Platform.DSA.user.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<RegisterResponseDTO> register(@Valid @RequestBody RegisterRequestDTO request) {
        return new ResponseEntity<>(userService.register(request), HttpStatus.OK);
    }
    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@Valid @RequestBody LoginRequestDTO request) {
        return new ResponseEntity<>(userService.login(request),HttpStatus.OK);
    }

    }

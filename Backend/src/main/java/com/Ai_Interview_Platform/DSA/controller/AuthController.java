package com.Ai_Interview_Platform.DSA.controller;

import com.Ai_Interview_Platform.DSA.dto.auth.LoginRequestDTO;
import com.Ai_Interview_Platform.DSA.dto.auth.LoginResponseDTO;
import com.Ai_Interview_Platform.DSA.dto.auth.RegisterRequestDTO;
import com.Ai_Interview_Platform.DSA.dto.auth.RegisterResponseDTO;
import com.Ai_Interview_Platform.DSA.service.UserService;
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
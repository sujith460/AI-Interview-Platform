package com.Ai_Interview_Platform.DSA.controller;

import com.Ai_Interview_Platform.DSA.dto.judge.RunCodeRequestDTO;
import com.Ai_Interview_Platform.DSA.dto.judge.RunCodeResponseDTO;
import com.Ai_Interview_Platform.DSA.dto.judge.SubmitCodeRequestDTO;
import com.Ai_Interview_Platform.DSA.dto.judge.SubmitCodeResponseDTO;
import com.Ai_Interview_Platform.DSA.service.JudgeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class JudgeController {

    private final JudgeService judgeService;

    @PostMapping("/run")
    public ResponseEntity<RunCodeResponseDTO> runCode(
            @Valid @RequestBody RunCodeRequestDTO request) {

        return ResponseEntity.ok(
                judgeService.runCode(request)
        );

    }

    @PostMapping("/submit")
    public ResponseEntity<SubmitCodeResponseDTO> submitCode(
            @Valid @RequestBody SubmitCodeRequestDTO request) {

        return ResponseEntity.ok(
                judgeService.submitCode(request)
        );

    }

}

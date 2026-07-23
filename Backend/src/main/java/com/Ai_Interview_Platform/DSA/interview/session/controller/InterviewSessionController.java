package com.Ai_Interview_Platform.DSA.interview.session.controller;

import com.Ai_Interview_Platform.DSA.interview.session.dto.InterviewSessionResponseDTO;
import com.Ai_Interview_Platform.DSA.interview.session.dto.StartInterviewRequestDTO;
import com.Ai_Interview_Platform.DSA.interview.session.service.InterviewSessionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/interview/sessions")
@RequiredArgsConstructor
public class InterviewSessionController {

    private final InterviewSessionService interviewSessionService;

    @PostMapping
    public ResponseEntity<InterviewSessionResponseDTO> startInterview(
            @Valid @RequestBody StartInterviewRequestDTO requestDTO) {

        InterviewSessionResponseDTO responseDTO =
                interviewSessionService.startInterview(requestDTO);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(responseDTO);
    }

}
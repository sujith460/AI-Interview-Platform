package com.Ai_Interview_Platform.DSA.interview.session.controller;

import com.Ai_Interview_Platform.DSA.ai.model.AIResponse;
import com.Ai_Interview_Platform.DSA.conversation.dto.CandidateMessageRequestDTO;
import com.Ai_Interview_Platform.DSA.interview.session.dto.InterviewCodeSubmissionDTO;
import com.Ai_Interview_Platform.DSA.interview.session.dto.InterviewReportDTO;
import com.Ai_Interview_Platform.DSA.interview.session.dto.InterviewSessionHistoryDTO;
import com.Ai_Interview_Platform.DSA.interview.session.dto.InterviewSessionResponseDTO;
import com.Ai_Interview_Platform.DSA.interview.session.dto.StartInterviewRequestDTO;
import com.Ai_Interview_Platform.DSA.interview.session.service.InterviewSessionService;
import com.fasterxml.jackson.core.JsonProcessingException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/interview/sessions")
@RequiredArgsConstructor
public class InterviewSessionController {

    private final InterviewSessionService interviewSessionService;

    @PostMapping
    public ResponseEntity<InterviewSessionResponseDTO> createSession(
            @Valid @RequestBody StartInterviewRequestDTO requestDTO) {

        InterviewSessionResponseDTO responseDTO =
                interviewSessionService.createInterviewSession(requestDTO);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(responseDTO);
    }

    @GetMapping
    public ResponseEntity<InterviewSessionHistoryDTO> getUserInterviewHistory() {
        InterviewSessionHistoryDTO history = interviewSessionService.getUserInterviewHistory();
        return ResponseEntity.ok(history);
    }

    @PostMapping("/{sessionId}/start")
    public ResponseEntity<AIResponse> startInterview(
            @PathVariable UUID sessionId) throws JsonProcessingException {

        AIResponse response = interviewSessionService.startInterview(sessionId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{sessionId}/message")
    public ResponseEntity<AIResponse> submitCandidateMessage(
            @PathVariable UUID sessionId,
            @Valid @RequestBody CandidateMessageRequestDTO requestDTO) throws JsonProcessingException {

        AIResponse response = interviewSessionService.submitCandidateMessage(sessionId, requestDTO);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{sessionId}/hint")
    public ResponseEntity<AIResponse> requestHint(
            @PathVariable UUID sessionId) throws JsonProcessingException {

        AIResponse response = interviewSessionService.requestHint(sessionId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{sessionId}/code")
    public ResponseEntity<AIResponse> submitCode(
            @PathVariable UUID sessionId,
            @Valid @RequestBody InterviewCodeSubmissionDTO requestDTO) throws JsonProcessingException {

        AIResponse response = interviewSessionService.submitCode(sessionId, requestDTO);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{sessionId}/finish")
    public ResponseEntity<AIResponse> finishInterview(
            @PathVariable UUID sessionId) throws JsonProcessingException {

        AIResponse response = interviewSessionService.finishInterview(sessionId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{sessionId}")
    public ResponseEntity<InterviewSessionResponseDTO> getInterviewSession(
            @PathVariable UUID sessionId) {

        InterviewSessionResponseDTO response = interviewSessionService.getInterviewSession(sessionId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{sessionId}/report")
    public ResponseEntity<InterviewReportDTO> getInterviewReport(
            @PathVariable UUID sessionId) {

        InterviewReportDTO report = interviewSessionService.getInterviewReport(sessionId);
        return ResponseEntity.ok(report);
    }

    @DeleteMapping("/{sessionId}")
    public ResponseEntity<Void> deleteInterviewSession(
            @PathVariable UUID sessionId) {

        interviewSessionService.deleteInterviewSession(sessionId);
        return ResponseEntity.noContent().build();
    }
}
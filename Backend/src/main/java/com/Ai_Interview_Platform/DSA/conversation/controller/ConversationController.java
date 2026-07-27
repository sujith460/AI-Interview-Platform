package com.Ai_Interview_Platform.DSA.conversation.controller;

import com.Ai_Interview_Platform.DSA.conversation.dto.ConversationHistoryResponseDTO;
import com.Ai_Interview_Platform.DSA.conversation.dto.ConversationMessageRequestDTO;
import com.Ai_Interview_Platform.DSA.conversation.dto.ConversationMessageResponseDTO;
import com.Ai_Interview_Platform.DSA.conversation.dto.ConversationResponseDTO;
import com.Ai_Interview_Platform.DSA.conversation.service.ConversationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/conversations")
@RequiredArgsConstructor
public class ConversationController {

    private final ConversationService conversationService;

    @PostMapping("/{interviewSessionId}")
    public ResponseEntity<ConversationResponseDTO> createConversation(
            @PathVariable UUID interviewSessionId
    ) {

        ConversationResponseDTO response =
                conversationService.createConversation(interviewSessionId);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/{conversationId}/messages")
    public ResponseEntity<ConversationMessageResponseDTO> addMessage(
            @PathVariable UUID conversationId,
            @Valid @RequestBody ConversationMessageRequestDTO request
    ) {

        ConversationMessageResponseDTO response =
                conversationService.addMessage(conversationId, request);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/session/{interviewSessionId}")
    public ResponseEntity<ConversationResponseDTO> getConversationByInterviewSession(
            @PathVariable UUID interviewSessionId
    ) {

        return ResponseEntity.ok(
                conversationService.getConversationByInterviewSession(interviewSessionId)
        );
    }

    @GetMapping("/{conversationId}/history")
    public ResponseEntity<ConversationHistoryResponseDTO> getConversationHistory(
            @PathVariable UUID conversationId
    ) {

        return ResponseEntity.ok(
                conversationService.getConversationHistory(conversationId)
        );
    }

}
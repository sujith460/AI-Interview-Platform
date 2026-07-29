package com.Ai_Interview_Platform.DSA.conversation.controller;

import com.Ai_Interview_Platform.DSA.conversation.dto.CandidateMessageRequestDTO;
import com.Ai_Interview_Platform.DSA.conversation.dto.ConversationHistoryResponseDTO;
import com.Ai_Interview_Platform.DSA.conversation.dto.ConversationMessageResponseDTO;
import com.Ai_Interview_Platform.DSA.conversation.service.MessageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/conversations")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;

    @PostMapping("/{conversationId}/messages/candidate")
    public ResponseEntity<ConversationMessageResponseDTO> addCandidateMessage(
            @PathVariable UUID conversationId,
            @Valid @RequestBody CandidateMessageRequestDTO request) {

        ConversationMessageResponseDTO response =
                messageService.addCandidateMessage(conversationId, request.getContent());

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/{conversationId}/messages/ai")
    public ResponseEntity<ConversationMessageResponseDTO> addAIMessage(
            @PathVariable UUID conversationId,
            @Valid @RequestBody CandidateMessageRequestDTO request) {

        ConversationMessageResponseDTO response =
                messageService.addAIMessage(conversationId, request.getContent());

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/{conversationId}/messages/system")
    public ResponseEntity<ConversationMessageResponseDTO> addSystemMessage(
            @PathVariable UUID conversationId,
            @Valid @RequestBody CandidateMessageRequestDTO request) {

        ConversationMessageResponseDTO response =
                messageService.addSystemMessage(conversationId, request.getContent());

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{conversationId}/messages")
    public ResponseEntity<ConversationHistoryResponseDTO> getConversationHistory(
            @PathVariable UUID conversationId) {

        return ResponseEntity.ok(messageService.getConversationHistory(conversationId));
    }

}

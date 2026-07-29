package com.Ai_Interview_Platform.DSA.conversation.controller;

import com.Ai_Interview_Platform.DSA.conversation.dto.ConversationResponseDTO;
import com.Ai_Interview_Platform.DSA.conversation.service.ConversationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/conversations")
@RequiredArgsConstructor
public class ConversationController {

    private final ConversationService conversationService;

    @GetMapping("/{conversationId}")
    public ResponseEntity<ConversationResponseDTO> getConversation(
            @PathVariable UUID conversationId
    ) {

        return ResponseEntity.ok(
                conversationService.getConversation(conversationId)
        );
    }

    @GetMapping("/session/{interviewSessionId}")
    public ResponseEntity<ConversationResponseDTO> getConversationByInterviewSession(
            @PathVariable UUID interviewSessionId
    ) {

        return ResponseEntity.ok(
                conversationService.getConversationByInterviewSession(interviewSessionId)
        );
    }

}
package com.Ai_Interview_Platform.DSA.conversation.dto;

import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ConversationResponseDTO {

    private UUID conversationId;

    private UUID interviewSessionId;

    private LocalDateTime createdAt;

}
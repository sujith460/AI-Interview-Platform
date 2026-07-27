package com.Ai_Interview_Platform.DSA.conversation.dto;

import lombok.*;

import java.util.List;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ConversationHistoryResponseDTO {

    private UUID conversationId;

    private List<ConversationMessageResponseDTO> messages;

}

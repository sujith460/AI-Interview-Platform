package com.Ai_Interview_Platform.DSA.conversation.dto;

import com.Ai_Interview_Platform.DSA.conversation.enums.MessageRole;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class  ConversationMessageResponseDTO {


    private UUID messageId;

    private MessageRole role;

    private String content;

    private LocalDateTime createdAt;

}
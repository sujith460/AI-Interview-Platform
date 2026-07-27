package com.Ai_Interview_Platform.DSA.conversation.dto;

import com.Ai_Interview_Platform.DSA.conversation.enums.MessageRole;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ConversationMessageRequestDTO {

    @NotNull
    private MessageRole role;

    @NotBlank
    private String content;

}
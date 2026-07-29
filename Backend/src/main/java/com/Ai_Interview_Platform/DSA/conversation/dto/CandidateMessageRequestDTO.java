package com.Ai_Interview_Platform.DSA.conversation.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CandidateMessageRequestDTO {

    @NotBlank
    private String content;

}

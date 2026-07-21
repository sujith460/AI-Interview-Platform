package com.Ai_Interview_Platform.DSA.dto.judge;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RunCodeRequestDTO {

    @NotNull(message = "Question Id is required")
    private Long questionId;

    @NotBlank(message = "Language is required")
    private String language;

    @NotBlank(message = "Code cannot be empty")
    private String code;

}
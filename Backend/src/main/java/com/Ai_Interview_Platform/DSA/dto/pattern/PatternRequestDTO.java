package com.Ai_Interview_Platform.DSA.dto.pattern;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class PatternRequestDTO {

    @NotBlank(message = "Pattern name is required")
    private String name;

    private String description;

}
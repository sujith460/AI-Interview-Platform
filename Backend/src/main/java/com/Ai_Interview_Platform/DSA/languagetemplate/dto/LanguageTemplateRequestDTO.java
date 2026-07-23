package com.Ai_Interview_Platform.DSA.languagetemplate.dto;

import com.Ai_Interview_Platform.DSA.common.enums.ProgrammingLanguage;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class LanguageTemplateRequestDTO {

    @NotNull(message = "Question ID is required")
    private Long questionId;

    @NotNull(message = "Language is required")
    private ProgrammingLanguage language;

    @NotBlank(message = "Starter code is required")
    private String starterCode;

    private String driverCode;

}

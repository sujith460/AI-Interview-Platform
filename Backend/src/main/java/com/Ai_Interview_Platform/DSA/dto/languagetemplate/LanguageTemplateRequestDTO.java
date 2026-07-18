package com.Ai_Interview_Platform.DSA.dto.languagetemplate;

import com.Ai_Interview_Platform.DSA.entity.enums.ProgrammingLanguage;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LanguageTemplateRequestDTO {

    @NotNull(message = "Question Id is required")
    private Long questionId;

    @NotNull(message = "Language is required")
    private ProgrammingLanguage language;

    @NotBlank(message = "Starter code is required")
    private String starterCode;

    private String driverCode;

}
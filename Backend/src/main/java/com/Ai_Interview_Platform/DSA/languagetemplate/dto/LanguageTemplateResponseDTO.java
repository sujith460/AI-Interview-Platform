package com.Ai_Interview_Platform.DSA.languagetemplate.dto;

import com.Ai_Interview_Platform.DSA.common.enums.ProgrammingLanguage;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LanguageTemplateResponseDTO {

    private Long id;

    private Long questionId;

    private ProgrammingLanguage language;

    private String starterCode;

    private String driverCode;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

}

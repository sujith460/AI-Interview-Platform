package com.Ai_Interview_Platform.DSA.interview.session.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InterviewCodeSubmissionDTO {

    @NotBlank(message = "Code content is required")
    private String code;

    private String programmingLanguage;
}

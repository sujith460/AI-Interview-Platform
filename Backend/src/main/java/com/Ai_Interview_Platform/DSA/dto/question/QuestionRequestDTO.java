package com.Ai_Interview_Platform.DSA.dto.question;

import com.Ai_Interview_Platform.DSA.entity.enums.Difficulty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.Set;

@Data
public class QuestionRequestDTO {

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    @NotNull(message = "Difficulty is required")
    private Difficulty difficulty;

    private String constraints;

    private String examples;

    private String functionSignature;

    private Integer estimatedTimeMinutes;

    private Boolean interviewQuestion;

    private Boolean premium;

    private Integer frequencyScore;

    private Set<Long> companyIds;

    private Set<Long> patternIds;

}
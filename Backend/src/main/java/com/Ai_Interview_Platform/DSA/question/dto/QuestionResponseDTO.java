package com.Ai_Interview_Platform.DSA.question.dto;

import com.Ai_Interview_Platform.DSA.question.enums.Difficulty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuestionResponseDTO {

    private Long id;

    private String title;

    private String slug;

    private Difficulty difficulty;

    private String description;

    private String constraints;

    private String examples;

    private String functionSignature;

    private Integer estimatedTimeMinutes;

    private Boolean interviewQuestion;

    private Boolean premium;

    private Set<String> companies;

    private Set<String> patterns;

    private Integer frequencyScore;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

}

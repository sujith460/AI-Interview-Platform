package com.Ai_Interview_Platform.DSA.dto.question;

import com.Ai_Interview_Platform.DSA.entity.enums.Difficulty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuestionResponseDTO {

    private Long id;

    private String title;

    private String slug;

    private String description;

    private Difficulty difficulty;

    private String constraints;

    private String examples;

    private String functionSignature;

    private Integer estimatedTimeMinutes;

    private Boolean interviewQuestion;

    private Boolean premium;

    private Integer frequencyScore;

    private Set<String> companies;

    private Set<String> patterns;

}
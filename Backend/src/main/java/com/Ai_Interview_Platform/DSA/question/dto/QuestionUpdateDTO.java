package com.Ai_Interview_Platform.DSA.question.dto;

import com.Ai_Interview_Platform.DSA.common.enums.Difficulty;
import lombok.Data;

import java.util.Set;

@Data
public class QuestionUpdateDTO {

    private String title;

    private String description;

    private Difficulty difficulty;

    private String constraints;

    private String examples;

    private String functionSignature;

    private Integer estimatedTimeMinutes;

    private Boolean interviewQuestion;

    private Boolean premium;

    private Set<Long> companyIds;

    private Set<Long> patternIds;

}

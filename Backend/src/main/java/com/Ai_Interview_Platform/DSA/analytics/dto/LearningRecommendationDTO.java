package com.Ai_Interview_Platform.DSA.analytics.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LearningRecommendationDTO {
    private int priority;
    private String topic;
    private String suggestedPractice;
    private String difficultyProgression;
    private String reason;
}

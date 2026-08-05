package com.Ai_Interview_Platform.DSA.analytics.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class KeyInsightsDTO {
    private String mostImprovedSkill;
    private String mostDifficultTopic;
    private String mostFrequentlyAskedTopic;
    private int avgThinkingTimeSeconds;
    private int avgCodingTimeSeconds;
    private String avgExplanationQuality;
    private String mostCommonMistake;
    private String mostSuccessfulCompany;
    private String mostChallengingCompany;
    private int longestInterviewMinutes;
    private int shortestInterviewMinutes;
}

package com.Ai_Interview_Platform.DSA.analytics.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserAnalyticsResponseDTO {
    private SummaryMetricsDTO summary;
    private String performanceSummary;
    private String recurringMistakes;
    private List<SkillRatingDTO> skillRatings;
    private List<String> strengths;
    private List<String> weaknesses;
    private List<LearningRecommendationDTO> learningRecommendations;
    private List<CompanyReadinessDTO> companyReadiness;
    private KeyInsightsDTO insights;
    private List<ProgressTrendDTO> progressTrends;
    private LocalDateTime lastUpdated;
    private boolean isCached;
}

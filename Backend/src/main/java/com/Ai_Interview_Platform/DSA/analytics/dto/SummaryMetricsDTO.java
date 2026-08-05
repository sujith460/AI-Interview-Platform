package com.Ai_Interview_Platform.DSA.analytics.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SummaryMetricsDTO {
    private long totalInterviews;
    private double averageScore;
    private long averageDurationMinutes;
    private int averageCodingAccuracy;
    private int interviewReadinessPercentage;
}

package com.Ai_Interview_Platform.DSA.analytics.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProgressTrendDTO {
    private String date;
    private int score;
    private int durationMinutes;
    private int codingAccuracy;
    private String topic;
    private String difficulty;
    private int communicationScore;
}

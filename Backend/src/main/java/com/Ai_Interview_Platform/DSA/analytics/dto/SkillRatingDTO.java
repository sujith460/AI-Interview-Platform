package com.Ai_Interview_Platform.DSA.analytics.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SkillRatingDTO {
    private String topic;
    private int score;
    private String trend; // "Improving", "Steady", "Needs Focus"
    private String level; // "Beginner", "Intermediate", "Advanced", "Expert"
    private String category; // "Data Structures", "Algorithms", "Core CS"
}

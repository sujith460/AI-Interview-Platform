package com.Ai_Interview_Platform.DSA.analytics.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CompanyReadinessDTO {
    private String companyName;
    private int score;
    private String verdict; // "Strong Hire", "Hire", "Leaning Hire", "Needs Work"
    private String explanation;
}

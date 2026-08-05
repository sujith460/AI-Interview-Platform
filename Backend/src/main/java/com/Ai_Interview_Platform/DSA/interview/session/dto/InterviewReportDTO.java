package com.Ai_Interview_Platform.DSA.interview.session.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InterviewReportDTO {
    private InterviewSessionResponseDTO session;
    private String overallSummary;
    private String hiringRecommendation;
    private List<QuestionTimelineDTO> questionTimeline;
}

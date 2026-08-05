package com.Ai_Interview_Platform.DSA.interview.session.dto;

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
public class InterviewSessionHistoryDTO {
    private long totalInterviews;
    private double averageScore;
    private long averageDurationMinutes;
    private LocalDateTime lastInterviewDate;
    private List<InterviewSessionResponseDTO> sessions;
}

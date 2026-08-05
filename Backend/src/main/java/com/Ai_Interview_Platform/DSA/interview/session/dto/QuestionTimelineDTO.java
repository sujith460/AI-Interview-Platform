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
public class QuestionTimelineDTO {
    private int questionNumber;
    private String question;
    private String candidateResponse;
    private String evaluation;
    private Integer score;
    private Integer timeTakenSeconds;
    private List<String> strengths;
    private List<String> weaknesses;
}

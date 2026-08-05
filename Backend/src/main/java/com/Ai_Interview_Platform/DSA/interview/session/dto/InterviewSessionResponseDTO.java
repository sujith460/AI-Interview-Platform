package com.Ai_Interview_Platform.DSA.interview.session.dto;

import com.Ai_Interview_Platform.DSA.interview.session.enums.InterviewState;
import com.Ai_Interview_Platform.DSA.interview.session.enums.InterviewType;
import com.Ai_Interview_Platform.DSA.question.enums.Difficulty;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class InterviewSessionResponseDTO {

    private UUID sessionId;
//
    private Long companyId;

    private String companyName;

    private String companyLogoUrl;

    private String role;

    private InterviewType interviewType;

    private Difficulty difficulty;

    private InterviewState state;

    private com.Ai_Interview_Platform.DSA.ai.enums.InterviewStage currentStage;

    private String currentTopic;

    private String currentQuestion;

    private String programmingLanguage;

    private Integer overallScore;

    private String finalEvaluation;

    private String aiFeedback;

    private Long durationMinutes;

    private LocalDateTime startedAt;

    private LocalDateTime endedAt;

    private LocalDateTime createdAt;
}
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

    private InterviewType interviewType;

    private Difficulty difficulty;

    private InterviewState state;

    private LocalDateTime startedAt;

    private LocalDateTime endedAt;

    private LocalDateTime createdAt;
}
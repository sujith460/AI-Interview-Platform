package com.Ai_Interview_Platform.DSA.interview.session.dto;

import com.Ai_Interview_Platform.DSA.interview.session.enums.InterviewType;
import com.Ai_Interview_Platform.DSA.question.enums.Difficulty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class StartInterviewRequestDTO {

    @NotNull
    private Long companyId;

    @NotNull
    private InterviewType interviewType;

    @NotNull
    private Difficulty difficulty;
}
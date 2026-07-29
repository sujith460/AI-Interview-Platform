package com.Ai_Interview_Platform.DSA.ai.model;

import com.Ai_Interview_Platform.DSA.ai.enums.InterviewStage;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AIResponse {


    private String response;


    private boolean success;


    private String errorMessage;


    private String finishReason;


    private Integer promptTokens;

    private Integer completionTokens;

    private Integer totalTokens;

}

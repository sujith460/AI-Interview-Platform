package com.Ai_Interview_Platform.DSA.ai.model;

import com.Ai_Interview_Platform.DSA.ai.enums.InterviewStage;
import com.Ai_Interview_Platform.DSA.conversation.entity.ConversationMessage;
import com.Ai_Interview_Platform.DSA.interview.session.enums.InterviewType;
import com.Ai_Interview_Platform.DSA.question.enums.Difficulty;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AIRequest {


    private String systemPrompt;

    private String userPrompt;


    private InterviewType interviewType;
    private InterviewStage interviewStage;
    private Difficulty difficulty;
    private String company;


    private String candidateAnswer;
    private String resume;


    private String programmingLanguage;
    private String code;


    private List<ConversationMessage> conversationHistory;

}
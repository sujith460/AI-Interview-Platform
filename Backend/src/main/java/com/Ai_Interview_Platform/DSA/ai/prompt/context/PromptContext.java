package com.Ai_Interview_Platform.DSA.ai.prompt.context;


import com.Ai_Interview_Platform.DSA.ai.enums.InterviewStage;
import com.Ai_Interview_Platform.DSA.conversation.entity.ConversationMessage;
import com.Ai_Interview_Platform.DSA.interview.session.enums.InterviewType;
import com.Ai_Interview_Platform.DSA.question.enums.Difficulty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PromptContext {

    private InterviewType interviewType;

    private InterviewStage interviewStage;

    private Difficulty difficulty;

    private String company;

    private String currentQuestion;

    private String candidateAnswer;

    private String resume;

    private String programmingLanguage;

    private String code;

    private List<ConversationMessage> conversationHistory;

    public String formatMessageContent(String content, int maxChars) {
        if (content == null) return "";
        if (content.length() <= maxChars) return content;
        return content.substring(0, maxChars) + "... [content truncated for token optimization]";
    }
}
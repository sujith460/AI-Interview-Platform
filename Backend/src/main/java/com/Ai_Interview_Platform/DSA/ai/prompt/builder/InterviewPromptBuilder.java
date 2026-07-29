package com.Ai_Interview_Platform.DSA.ai.prompt.builder;



import com.Ai_Interview_Platform.DSA.ai.prompt.context.PromptContext;
import com.Ai_Interview_Platform.DSA.ai.prompt.model.Prompt;
import com.Ai_Interview_Platform.DSA.ai.prompt.template.PromptTemplate;
import com.Ai_Interview_Platform.DSA.ai.prompt.template.SystemPromptFactory;
import com.Ai_Interview_Platform.DSA.conversation.entity.ConversationMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class InterviewPromptBuilder {

    private final SystemPromptFactory systemPromptFactory;


    public Prompt build(PromptContext context) {

        String systemPrompt = systemPromptFactory.buildSystemPrompt(context);

        StringBuilder userPrompt = new StringBuilder();


        userPrompt.append(PromptTemplate.TECHNICAL_INTERVIEW.getTemplate())
                .append("\n\n");

        userPrompt.append("""
                Instructions for Interviewer Response:
                1. Briefly evaluate candidate's latest response (1-2 sentences).
                2. DO NOT teach, lecture, or explain the optimal algorithm or code implementation.
                3. Ask exactly ONE probing follow-up question (e.g. asking for time/space complexity, edge cases, or transitioning to coding).
                4. Keep total response concise (max 3 sentences total + 1 question).

                """);

        // Current Question
        if (context.getCurrentQuestion() != null &&
                !context.getCurrentQuestion().isBlank()) {

            userPrompt.append("Current Question:\n")
                    .append(context.getCurrentQuestion())
                    .append("\n\n");
        }

        // Candidate Answer
        if (context.getCandidateAnswer() != null &&
                !context.getCandidateAnswer().isBlank()) {

            userPrompt.append("Candidate Answer:\n")
                    .append(context.getCandidateAnswer())
                    .append("\n\n");
        }

        // Resume
        if (context.getResume() != null &&
                !context.getResume().isBlank()) {

            userPrompt.append("Candidate Resume:\n")
                    .append(context.getResume())
                    .append("\n\n");
        }

        // Programming Language
        if (context.getProgrammingLanguage() != null &&
                !context.getProgrammingLanguage().isBlank()) {

            userPrompt.append("Programming Language:\n")
                    .append(context.getProgrammingLanguage())
                    .append("\n\n");
        }

        // Submitted Code
        if (context.getCode() != null &&
                !context.getCode().isBlank()) {

            userPrompt.append("Submitted Code:\n")
                    .append(context.getCode())
                    .append("\n\n");
        }

        // Conversation History
        if (context.getConversationHistory() != null &&
                !context.getConversationHistory().isEmpty()) {

            userPrompt.append("Conversation History:\n");

            for (ConversationMessage message : context.getConversationHistory()) {
                userPrompt.append(message.getRole())
                        .append(": ")
                        .append(context.formatMessageContent(message.getContent(), 400))
                        .append("\n");
            }

            userPrompt.append("\n");
        }

        return Prompt.builder()
                .systemPrompt(systemPrompt)
                .userPrompt(userPrompt.toString())
                .build();
    }

}
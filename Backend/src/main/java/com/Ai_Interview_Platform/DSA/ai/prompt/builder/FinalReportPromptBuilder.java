package com.Ai_Interview_Platform.DSA.ai.prompt.builder;


import com.Ai_Interview_Platform.DSA.ai.prompt.context.PromptContext;
import com.Ai_Interview_Platform.DSA.ai.prompt.model.Prompt;
import com.Ai_Interview_Platform.DSA.ai.prompt.template.SystemPromptFactory;
import com.Ai_Interview_Platform.DSA.conversation.entity.ConversationMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class FinalReportPromptBuilder {

    private final SystemPromptFactory systemPromptFactory;

    public Prompt build(PromptContext context) {

        String systemPrompt = systemPromptFactory.buildSystemPrompt(context);

        StringBuilder userPrompt = new StringBuilder();

        userPrompt.append("""
                The interview has been completed.

                Generate a comprehensive interview report.

                Your report must include:

                1. Overall Performance Summary
                2. Technical Knowledge Assessment
                3. Coding Skills Assessment
                4. Problem Solving Ability
                5. Communication Skills
                6. Strengths
                7. Areas for Improvement
                8. Recommended Learning Topics
                9. Overall Score (out of 10)
                10. Hiring Recommendation
                    - Strong Hire
                    - Hire
                    - Borderline
                    - No Hire

                Keep the report professional, objective and concise.
                Do not ask additional interview questions.
                """);

        if (context.getResume() != null &&
                !context.getResume().isBlank()) {

            userPrompt.append("\n\nCandidate Resume:\n")
                    .append(context.getResume());
        }

        if (context.getConversationHistory() != null &&
                !context.getConversationHistory().isEmpty()) {

            userPrompt.append("\n\nComplete Interview Conversation:\n");

            for (ConversationMessage message : context.getConversationHistory()) {
                userPrompt.append(message.getRole())
                        .append(": ")
                        .append(context.formatMessageContent(message.getContent(), 600))
                        .append("\n");
            }
        }

        return Prompt.builder()
                .systemPrompt(systemPrompt)
                .userPrompt(userPrompt.toString())
                .build();
    }
}
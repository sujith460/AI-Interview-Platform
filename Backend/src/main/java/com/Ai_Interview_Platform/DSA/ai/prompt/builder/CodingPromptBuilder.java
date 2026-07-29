package com.Ai_Interview_Platform.DSA.ai.prompt.builder;


import com.Ai_Interview_Platform.DSA.ai.prompt.context.PromptContext;
import com.Ai_Interview_Platform.DSA.ai.prompt.model.Prompt;
import com.Ai_Interview_Platform.DSA.ai.prompt.template.SystemPromptFactory;
import com.Ai_Interview_Platform.DSA.conversation.entity.ConversationMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CodingPromptBuilder {

    private final SystemPromptFactory systemPromptFactory;

    public Prompt build(PromptContext context) {

        String systemPrompt = systemPromptFactory.buildSystemPrompt(context);

        StringBuilder userPrompt = new StringBuilder();

        userPrompt.append("""
                Review the candidate's submitted source code as a live interviewer.

                Rules:
                1. State concisely in 1-2 sentences whether the solution logic works or has bugs/unhandled edge cases.
                2. Do NOT output scores, detailed code quality breakdowns, or tutorial suggestions.
                3. Do NOT rewrite the candidate's code or reveal the optimal solution.
                4. End your response with ONE probing question (e.g., asking for time/space complexity analysis or how to handle a specific edge case).
                5. Maintain a professional technical interviewer tone.

                """);

        if (context.getProgrammingLanguage() != null &&
                !context.getProgrammingLanguage().isBlank()) {

            userPrompt.append("Programming Language:\n")
                    .append(context.getProgrammingLanguage())
                    .append("\n\n");
        }

        if (context.getCurrentQuestion() != null &&
                !context.getCurrentQuestion().isBlank()) {

            userPrompt.append("Coding Question:\n")
                    .append(context.getCurrentQuestion())
                    .append("\n\n");
        }

        if (context.getCode() != null &&
                !context.getCode().isBlank()) {

            userPrompt.append("Candidate Code:\n")
                    .append(context.getCode())
                    .append("\n\n");
        }

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
package com.Ai_Interview_Platform.DSA.ai.prompt.builder;


import com.Ai_Interview_Platform.DSA.ai.prompt.context.PromptContext;
import com.Ai_Interview_Platform.DSA.ai.prompt.model.Prompt;
import com.Ai_Interview_Platform.DSA.ai.prompt.template.SystemPromptFactory;
import com.Ai_Interview_Platform.DSA.conversation.entity.ConversationMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class HintPromptBuilder {

    private final SystemPromptFactory systemPromptFactory;

    public Prompt build(PromptContext context) {

        String systemPrompt = systemPromptFactory.buildSystemPrompt(context);

        StringBuilder userPrompt = new StringBuilder();

        userPrompt.append("""
                The candidate has requested a hint.

                Your task is to provide exactly ONE helpful hint.

                Rules:

                1. Do NOT provide the complete solution.
                2. Do NOT provide complete source code.
                3. Do NOT reveal the final algorithm.
                4. Guide the candidate toward the correct approach.
                5. Encourage logical thinking.
                6. Keep the hint concise.
                7. If the candidate has submitted code, base the hint on their current implementation.
                """);

        if (context.getCurrentQuestion() != null &&
                !context.getCurrentQuestion().isBlank()) {

            userPrompt.append("\n\nCoding Question:\n")
                    .append(context.getCurrentQuestion());
        }

        if (context.getProgrammingLanguage() != null &&
                !context.getProgrammingLanguage().isBlank()) {

            userPrompt.append("\n\nProgramming Language:\n")
                    .append(context.getProgrammingLanguage());
        }

        if (context.getCode() != null &&
                !context.getCode().isBlank()) {

            userPrompt.append("\n\nCandidate Code:\n")
                    .append(context.getCode());
        }

        if (context.getConversationHistory() != null &&
                !context.getConversationHistory().isEmpty()) {

            userPrompt.append("\n\nConversation History:\n");

            for (ConversationMessage message : context.getConversationHistory()) {
                userPrompt.append(message.getRole())
                        .append(": ")
                        .append(context.formatMessageContent(message.getContent(), 400))
                        .append("\n");
            }
        }

        return Prompt.builder()
                .systemPrompt(systemPrompt)
                .userPrompt(userPrompt.toString())
                .build();
    }
}
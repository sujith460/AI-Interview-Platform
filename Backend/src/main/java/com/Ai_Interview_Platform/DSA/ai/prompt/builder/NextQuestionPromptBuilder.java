package com.Ai_Interview_Platform.DSA.ai.prompt.builder;


import com.Ai_Interview_Platform.DSA.ai.prompt.context.PromptContext;
import com.Ai_Interview_Platform.DSA.ai.prompt.model.Prompt;
import com.Ai_Interview_Platform.DSA.ai.prompt.template.SystemPromptFactory;
import com.Ai_Interview_Platform.DSA.conversation.entity.ConversationMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class NextQuestionPromptBuilder {

    private final SystemPromptFactory systemPromptFactory;

    public Prompt build(PromptContext context) {

        String systemPrompt = systemPromptFactory.buildSystemPrompt(context);

        StringBuilder userPrompt = new StringBuilder();

        userPrompt.append("""
                Generate the next interview question.

                Rules:

                1. Ask only ONE question.
                2. Do not greet the candidate.
                3. Do not evaluate the previous answer.
                4. Do not provide hints.
                5. Generate the next logical question.
                6. Match the interview difficulty.
                7. Keep the question clear and concise.
                8. Return only the question.

                """);

        if (context.getDifficulty() != null) {
            userPrompt.append("Difficulty: ")
                    .append(context.getDifficulty())
                    .append("\n\n");
        }

        if (context.getCurrentQuestion() != null &&
                !context.getCurrentQuestion().isBlank()) {

            userPrompt.append("Previous Question:\n")
                    .append(context.getCurrentQuestion())
                    .append("\n\n");
        }

        if (context.getCandidateAnswer() != null &&
                !context.getCandidateAnswer().isBlank()) {

            userPrompt.append("Previous Candidate Answer:\n")
                    .append(context.getCandidateAnswer())
                    .append("\n\n");
        }

        if (context.getResume() != null &&
                !context.getResume().isBlank()) {

            userPrompt.append("Candidate Resume:\n")
                    .append(context.getResume())
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
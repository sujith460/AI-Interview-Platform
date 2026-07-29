package com.Ai_Interview_Platform.DSA.ai.prompt.builder;


import com.Ai_Interview_Platform.DSA.ai.prompt.context.PromptContext;
import com.Ai_Interview_Platform.DSA.ai.prompt.model.Prompt;
import com.Ai_Interview_Platform.DSA.ai.prompt.template.SystemPromptFactory;
import com.Ai_Interview_Platform.DSA.conversation.entity.ConversationMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class EvaluationPromptBuilder {

    private final SystemPromptFactory systemPromptFactory;

    public Prompt build(PromptContext context) {

        String systemPrompt = systemPromptFactory.buildSystemPrompt(context);

        StringBuilder userPrompt = new StringBuilder();

        userPrompt.append("""
                Evaluate the candidate's answer.

                Your evaluation must include:

                1. Correctness
                2. Strengths
                3. Weaknesses
                4. Missing Concepts
                5. Difficulty Recommendation
                6. Score out of 10

                Do NOT generate the next interview question.
                Keep the evaluation concise and professional.

                """);

        if (context.getCurrentQuestion() != null &&
                !context.getCurrentQuestion().isBlank()) {

            userPrompt.append("Question:\n")
                    .append(context.getCurrentQuestion())
                    .append("\n\n");
        }

        if (context.getCandidateAnswer() != null &&
                !context.getCandidateAnswer().isBlank()) {

            userPrompt.append("Candidate Answer:\n")
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
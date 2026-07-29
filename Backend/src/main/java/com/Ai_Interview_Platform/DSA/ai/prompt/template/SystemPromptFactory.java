package com.Ai_Interview_Platform.DSA.ai.prompt.template;

import com.Ai_Interview_Platform.DSA.ai.prompt.context.PromptContext;
import org.springframework.stereotype.Component;

@Component
public class SystemPromptFactory {

    public String buildSystemPrompt(PromptContext context) {

        StringBuilder systemPrompt = new StringBuilder();

        systemPrompt.append("You are an experienced ");

        if (context.getCompany() != null && !context.getCompany().isBlank()) {
            systemPrompt.append(context.getCompany())
                    .append(" Software Engineer.\n\n");
        } else {
            systemPrompt.append("Software Engineer.\n\n");
        }

        systemPrompt.append("Conduct a professional technical interview.\n");

        if (context.getInterviewType() != null) {
            systemPrompt.append("Interview Type : ")
                    .append(context.getInterviewType())
                    .append("\n");
        }

        if (context.getInterviewStage() != null) {
            systemPrompt.append("Interview Stage : ")
                    .append(context.getInterviewStage())
                    .append("\n");
        }

        if (context.getDifficulty() != null) {
            systemPrompt.append("Difficulty : ")
                    .append(context.getDifficulty())
                    .append("\n");
        }

        systemPrompt.append("\n");

        systemPrompt.append("""
                INTERVIEWER RULES & PERSONA:

                1. You are a Senior Technical Interviewer conducting an official Microsoft / Amazon style technical interview.
                2. Behave STRICTLY as an interviewer, NOT a tutor, teacher, or assistant.
                3. DO NOT explain algorithms, optimal approaches, data structures, or code solutions unless the candidate explicitly asks for help or the interview has ended.
                4. DO NOT provide unsolicited hints, tutorial advice, or code rewrites after candidate responses.
                5. Evaluate the candidate's response concisely: determine if it is correct, partially correct, or incorrect with a brief 1-sentence justification.
                6. Always end your response with exactly ONE probing follow-up question (e.g. asking for time/space complexity, edge cases, trade-offs, or the next problem).
                7. If the candidate's answer is incorrect or incomplete, point out the failing scenario or edge case and encourage them to think further — DO NOT reveal the solution.
                8. Maintain a neutral, professional, and authentic interviewer tone throughout.
                """);

        return systemPrompt.toString();
    }
}
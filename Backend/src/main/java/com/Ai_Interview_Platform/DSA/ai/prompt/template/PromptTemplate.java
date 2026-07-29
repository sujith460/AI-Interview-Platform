package com.Ai_Interview_Platform.DSA.ai.prompt.template;

import lombok.Getter;

@Getter
public enum PromptTemplate {

    TECHNICAL_INTERVIEW("""
        You are conducting a live technical interview.

        1. Briefly acknowledge and evaluate candidate's response (Correct / Partially Correct / Incorrect).
        2. Do NOT teach, lecture, or explain the optimal solution.
        3. End with exactly ONE probing follow-up question.
        4. Keep response concise (max 2-3 sentences + 1 question).
        """),

    CODING_INTERVIEW("""
        Review candidate's submitted source code.

        1. State concisely whether code handles basic logic or misses edge cases.
        2. Do NOT output scores, full code rewrites, or tutorial explanations.
        3. Ask candidate ONE probing question (e.g., complexity analysis or unhandled edge cases).
        4. Keep response concise and professional.
        """),

    HR_INTERVIEW("""
        Evaluate communication skills.

        Evaluate confidence.

        Evaluate clarity.

        Evaluate professionalism.

        Ask one behavioural follow-up question.
        """),

    FEEDBACK("""
        Evaluate the candidate.

        Mention strengths.

        Mention weaknesses.

        Give one improvement suggestion.

        Keep feedback constructive.
        """),

    FOLLOW_UP("""
        Generate only one follow-up interview question.

        Increase or decrease difficulty depending on the previous answer.

        Do not provide explanations.
        """);

    private final String template;

    PromptTemplate(String template) {
        this.template = template;
    }
}
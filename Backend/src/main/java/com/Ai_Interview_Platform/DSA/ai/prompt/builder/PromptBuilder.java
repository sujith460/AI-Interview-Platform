package com.Ai_Interview_Platform.DSA.ai.prompt.builder;

import com.Ai_Interview_Platform.DSA.ai.prompt.context.PromptContext;
import com.Ai_Interview_Platform.DSA.ai.prompt.model.Prompt;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class PromptBuilder {

    private final InterviewPromptBuilder interviewPromptBuilder;
    private final EvaluationPromptBuilder evaluationPromptBuilder;
    private final NextQuestionPromptBuilder nextQuestionPromptBuilder;
    private final CodingPromptBuilder codingPromptBuilder;
    private final HintPromptBuilder hintPromptBuilder;
    private final FinalReportPromptBuilder finalReportPromptBuilder;

    public Prompt buildInterviewPrompt(PromptContext context) {
        return interviewPromptBuilder.build(context);
    }

    public Prompt buildEvaluationPrompt(PromptContext context) {
        return evaluationPromptBuilder.build(context);
    }

    public Prompt buildNextQuestionPrompt(PromptContext context) {
        return nextQuestionPromptBuilder.build(context);
    }

    public Prompt buildCodingPrompt(PromptContext context) {
        return codingPromptBuilder.build(context);
    }

    public Prompt buildHintPrompt(PromptContext context) {
        return hintPromptBuilder.build(context);
    }

    public Prompt buildFinalReportPrompt(PromptContext context) {
        return finalReportPromptBuilder.build(context);
    }

}
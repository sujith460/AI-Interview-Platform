package com.Ai_Interview_Platform.DSA.ai.mapper;

import com.Ai_Interview_Platform.DSA.ai.model.AIRequest;
import com.Ai_Interview_Platform.DSA.ai.prompt.model.Prompt;
import org.springframework.stereotype.Component;

@Component
public class PromptMapper {

    public AIRequest toAIRequest(Prompt prompt) {

        return AIRequest.builder()
                .systemPrompt(prompt.getSystemPrompt())
                .userPrompt(prompt.getUserPrompt())
                .build();

    }

}
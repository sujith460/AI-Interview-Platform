package com.Ai_Interview_Platform.DSA.ai.provider.gemini.mapper;

import com.Ai_Interview_Platform.DSA.ai.model.AIRequest;
import com.Ai_Interview_Platform.DSA.ai.provider.gemini.dto.GeminiContentDTO;

import com.Ai_Interview_Platform.DSA.ai.provider.gemini.dto.GeminiPartDTO;
import com.Ai_Interview_Platform.DSA.ai.provider.gemini.dto.GeminiRequestDTO;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class GeminiRequestMapper {

    public GeminiRequestDTO toGeminiRequest(AIRequest request) {

        GeminiPartDTO part = GeminiPartDTO.builder()
                .text(request.getSystemPrompt()+request.getUserPrompt())
                .build();

        GeminiContentDTO content = GeminiContentDTO.builder()
                .parts(List.of(part))
                .build();



        return GeminiRequestDTO.builder()
                .contents(List.of(content))
                .build();
    }

}
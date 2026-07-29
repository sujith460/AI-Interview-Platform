package com.Ai_Interview_Platform.DSA.ai.service.impl;

import com.Ai_Interview_Platform.DSA.ai.client.AIClient;
import com.Ai_Interview_Platform.DSA.ai.model.AIRequest;
import com.Ai_Interview_Platform.DSA.ai.model.AIResponse;
import com.Ai_Interview_Platform.DSA.ai.service.AIService;
import com.fasterxml.jackson.core.JsonProcessingException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class AIServiceImpl implements AIService {

    private final AIClient aiClient;

    @Override
    public AIResponse generateResponse(AIRequest request) throws JsonProcessingException {

        StringBuilder finalAnswer = new StringBuilder();

        while (true) {

            AIResponse response = aiClient.generateResponse(request);

            if (response.getResponse() != null) {
                finalAnswer.append(response.getResponse());
            }

            if (response.getFinishReason() == null || 
                "STOP".equalsIgnoreCase(response.getFinishReason()) || 
                response.getResponse() == null || 
                response.getResponse().isBlank()) {
                break;
            }

            request.setUserPrompt(
                    "Continue exactly where you stopped. Do not repeat anything."
            );
        }

        return AIResponse.builder()
                .response(finalAnswer.toString())
                .success(true)
                .build();
    }
}
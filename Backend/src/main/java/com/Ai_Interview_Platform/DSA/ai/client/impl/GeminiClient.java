package com.Ai_Interview_Platform.DSA.ai.client.impl;

import com.Ai_Interview_Platform.DSA.ai.client.AIClient;
import com.Ai_Interview_Platform.DSA.ai.model.AIRequest;
import com.Ai_Interview_Platform.DSA.ai.model.AIResponse;

import com.Ai_Interview_Platform.DSA.ai.properties.AIProperties;
import com.Ai_Interview_Platform.DSA.ai.provider.gemini.dto.GeminiRequestDTO;
import com.Ai_Interview_Platform.DSA.ai.provider.gemini.dto.GeminiResponseDTO;
import com.Ai_Interview_Platform.DSA.ai.provider.gemini.mapper.GeminiRequestMapper;
import com.Ai_Interview_Platform.DSA.ai.provider.gemini.parser.GeminiResponseParser;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class GeminiClient implements AIClient {

    private final WebClient webClient;

    private final AIProperties properties;

    private final GeminiRequestMapper requestMapper;

    private final GeminiResponseParser parser;

    @Override
    public AIResponse generateResponse(AIRequest request) throws JsonProcessingException {
        GeminiRequestDTO geminiRequest =
                requestMapper.toGeminiRequest(request);

        GeminiResponseDTO response =
                callGemini(geminiRequest);

        return parser.parse(response);
    }

    private GeminiResponseDTO callGemini(
            GeminiRequestDTO request) throws JsonProcessingException {

        String uri = String.format(
                "/v1beta/models/%s:generateContent?key=%s",
                properties.getModel(),
                properties.getKey()
        );

        ObjectMapper mapper = new ObjectMapper();

        try {
            System.out.println("\n========== GEMINI URL ==========");
            System.out.println(properties.getBaseUrl() + uri);

            System.out.println("\n========== GEMINI REQUEST ==========");
            System.out.println(
                    mapper.writerWithDefaultPrettyPrinter()
                            .writeValueAsString(request)
            );
        } catch (Exception e) {
            e.printStackTrace();
        }

        System.out.println("Sending request to Gemini...");
        String response = null;
        try {
            response = webClient
                    .post()
                    .uri(uri)
                    .bodyValue(request)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();
        } catch (org.springframework.web.reactive.function.client.WebClientResponseException e) {
            log.error("Gemini API Error - Status: {}, Body: {}", e.getStatusCode(), e.getResponseBodyAsString(), e);
            if (e.getStatusCode().value() == 429) {
                throw new IllegalStateException("Gemini API Rate Limit Exceeded (HTTP 429). Please wait a few seconds and try again.");
            }
            throw new IllegalStateException("Gemini API HTTP Error " + e.getStatusCode() + ": " + e.getResponseBodyAsString(), e);
        } catch (Exception e) {
            log.error("Failed to connect to Gemini API: {}", e.getMessage(), e);
            throw new IllegalStateException("Failed to communicate with Gemini API: " + e.getMessage(), e);
        }

        System.out.println("========== GEMINI RAW RESPONSE ==========");
        System.out.println(response);

        return new ObjectMapper().readValue(response, GeminiResponseDTO.class);
    }


}
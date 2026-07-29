package com.Ai_Interview_Platform.DSA.ai.client;


import com.Ai_Interview_Platform.DSA.ai.model.AIRequest;
import com.Ai_Interview_Platform.DSA.ai.model.AIResponse;
import com.fasterxml.jackson.core.JsonProcessingException;

public interface AIClient {

    AIResponse generateResponse(AIRequest request) throws JsonProcessingException;
}
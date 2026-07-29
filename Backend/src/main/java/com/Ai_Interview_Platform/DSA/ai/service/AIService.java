package com.Ai_Interview_Platform.DSA.ai.service;

import com.Ai_Interview_Platform.DSA.ai.model.AIRequest;
import com.Ai_Interview_Platform.DSA.ai.model.AIResponse;
import com.fasterxml.jackson.core.JsonProcessingException;

public interface AIService {

    AIResponse generateResponse(AIRequest request) throws JsonProcessingException;

}
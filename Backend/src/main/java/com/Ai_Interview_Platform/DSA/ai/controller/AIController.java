package com.Ai_Interview_Platform.DSA.ai.controller;

import com.Ai_Interview_Platform.DSA.ai.model.AIRequest;
import com.Ai_Interview_Platform.DSA.ai.model.AIResponse;
import com.Ai_Interview_Platform.DSA.ai.service.AIService;
import com.fasterxml.jackson.core.JsonProcessingException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AIController {

    private final AIService aiService;

    @PostMapping("/generate")
    public ResponseEntity<AIResponse> generateResponse(
            @Valid @RequestBody AIRequest request) throws JsonProcessingException {

        AIResponse response = aiService.generateResponse(request);

        return ResponseEntity.ok(response);
    }

}
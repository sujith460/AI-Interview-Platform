package com.Ai_Interview_Platform.DSA.ai.provider.gemini.parser;

import com.Ai_Interview_Platform.DSA.ai.model.AIResponse;
import com.Ai_Interview_Platform.DSA.ai.provider.gemini.dto.GeminiCandidateDTO;
import com.Ai_Interview_Platform.DSA.ai.provider.gemini.dto.GeminiResponseDTO;
import com.Ai_Interview_Platform.DSA.ai.provider.gemini.dto.GeminiUsageMetadataDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class GeminiResponseParser {

    public AIResponse parse(GeminiResponseDTO response) {

        if (response == null || response.getCandidates() == null || response.getCandidates().isEmpty()) {
            log.warn("Gemini response has no candidates: {}", response);
            return AIResponse.builder()
                    .response("I apologize, but I couldn't generate a response. Please try sending your response again.")
                    .success(false)
                    .finishReason("NO_CANDIDATE")
                    .build();
        }

        GeminiCandidateDTO candidate = response.getCandidates().get(0);
        String generatedText = null;

        if (candidate != null &&
            candidate.getContent() != null &&
            candidate.getContent().getParts() != null &&
            !candidate.getContent().getParts().isEmpty() &&
            candidate.getContent().getParts().get(0) != null) {
            generatedText = candidate.getContent().getParts().get(0).getText();
        }

        if (generatedText == null || generatedText.isBlank()) {
            generatedText = "I understand. Could you please elaborate further on your approach?";
        }

        GeminiUsageMetadataDTO usage = response.getUsageMetadata();

        return AIResponse.builder()
                .response(generatedText)
                .success(true)
                .finishReason(candidate != null ? candidate.getFinishReason() : "STOP")
                .promptTokens(
                        usage != null ? usage.getPromptTokenCount() : null
                )
                .completionTokens(
                        usage != null ? usage.getCandidatesTokenCount() : null
                )
                .totalTokens(
                        usage != null ? usage.getTotalTokenCount() : null
                )
                .build();
    }

}
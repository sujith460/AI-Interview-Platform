package com.Ai_Interview_Platform.DSA.ai.prompt.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Prompt {

    private String systemPrompt;

    private String userPrompt;

}
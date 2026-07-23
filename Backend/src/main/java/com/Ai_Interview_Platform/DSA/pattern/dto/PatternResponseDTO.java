package com.Ai_Interview_Platform.DSA.pattern.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PatternResponseDTO {

    private Long id;

    private String name;

    private String description;
}

package com.Ai_Interview_Platform.DSA.question.dto;

import com.Ai_Interview_Platform.DSA.common.enums.Difficulty;
import com.Ai_Interview_Platform.DSA.testcase.dto.TestCaseResponseDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuestionDetailsResponseDTO {

    private Long id;

    private String title;

    private String slug;

    private String description;

    private Difficulty difficulty;

    private String constraints;

    private String examples;

    private String functionSignature;

    private Integer estimatedTimeMinutes;

    private Set<String> companies;

    private Set<String> patterns;

    private Set<TestCaseResponseDTO> sampleTestCases;

}

package com.Ai_Interview_Platform.DSA.testcase.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TestCaseResponseDTO {

    private Long id;

    private Long questionId;

    private String input;

    private String expectedOutput;

    private String explanation;

    private Boolean sample;

    private Integer orderIndex;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

}

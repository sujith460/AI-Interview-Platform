package com.Ai_Interview_Platform.DSA.testcase.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class TestCaseRequestDTO {

    @NotNull(message = "Question ID is required")
    private Long questionId;

    @NotBlank(message = "Input is required")
    private String input;

    @NotBlank(message = "Expected output is required")
    private String expectedOutput;

    private String explanation;

    @NotNull(message = "Sample flag is required")
    private Boolean sample;

    @NotNull(message = "Order index is required")
    private Integer orderIndex;

}

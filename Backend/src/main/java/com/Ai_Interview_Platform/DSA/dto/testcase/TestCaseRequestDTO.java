package com.Ai_Interview_Platform.DSA.dto.testcase;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TestCaseRequestDTO {

    @NotNull(message = "Question Id is required")
    private Long questionId;

    @NotBlank(message = "Input is required")
    private String input;

    @NotBlank(message = "Expected output is required")
    private String expectedOutput;

    private String explanation;

    @NotNull(message = "Sample field is required")
    private Boolean sample;

    @NotNull(message = "Order index is required")
    private Integer orderIndex;

}
package com.Ai_Interview_Platform.DSA.coding.dto.judge;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubmitCodeResponseDTO {

    private boolean success;

    private String status;

    private int passedTestCases;

    private int totalTestCases;

    private FailedTestCaseDTO failedTestCase;

    private Long runtimeMs;

    private Double memoryMb;

}

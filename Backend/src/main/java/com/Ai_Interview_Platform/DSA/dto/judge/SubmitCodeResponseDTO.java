package com.Ai_Interview_Platform.DSA.dto.judge;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SubmitCodeResponseDTO {

    private boolean success;

    private String status;

    private int passedTestCases;

    private int totalTestCases;

    private FailedTestCaseDTO failedTestCase;

    private Long runtimeMs;

    private Double memoryMb;

}
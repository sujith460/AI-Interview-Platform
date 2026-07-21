package com.Ai_Interview_Platform.DSA.dto.judge;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class FailedTestCaseDTO {

    private String input;

    private String expectedOutput;

    private String actualOutput;

}
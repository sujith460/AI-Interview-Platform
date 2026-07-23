package com.Ai_Interview_Platform.DSA.coding.dto.judge;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FailedTestCaseDTO {

    private String input;

    private String expectedOutput;

    private String actualOutput;

}

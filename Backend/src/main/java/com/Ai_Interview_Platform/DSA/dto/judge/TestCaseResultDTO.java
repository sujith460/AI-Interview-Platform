package com.Ai_Interview_Platform.DSA.dto.judge;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TestCaseResultDTO {

    private int orderIndex;

    private String input;

    private String expectedOutput;

    private String actualOutput;

    private boolean passed;

    private String status;

    private String error;

}

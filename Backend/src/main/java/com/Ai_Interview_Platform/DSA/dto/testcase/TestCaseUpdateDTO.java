package com.Ai_Interview_Platform.DSA.dto.testcase;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TestCaseUpdateDTO {

    private String input;

    private String expectedOutput;

    private String explanation;

    private Boolean sample;

    private Integer orderIndex;

}
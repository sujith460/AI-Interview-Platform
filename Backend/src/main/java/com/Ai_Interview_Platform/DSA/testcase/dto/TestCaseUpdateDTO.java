package com.Ai_Interview_Platform.DSA.testcase.dto;

import lombok.Data;

@Data
public class TestCaseUpdateDTO {

    private String input;

    private String expectedOutput;

    private String explanation;

    private Boolean sample;

    private Integer orderIndex;

}

package com.Ai_Interview_Platform.DSA.dto.judge;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class RunCodeResponseDTO {

    private boolean success;

    private String output;

    private String error;

    private List<TestCaseResultDTO> testCaseResults;

}
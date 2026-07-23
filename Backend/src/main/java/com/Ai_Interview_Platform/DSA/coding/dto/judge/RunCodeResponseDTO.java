package com.Ai_Interview_Platform.DSA.coding.dto.judge;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RunCodeResponseDTO {

    private boolean success;

    private String output;

    private String error;

    private List<TestCaseResultDTO> testCaseResults;

}

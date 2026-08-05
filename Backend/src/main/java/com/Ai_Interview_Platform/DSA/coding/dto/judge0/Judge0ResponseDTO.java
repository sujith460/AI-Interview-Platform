package com.Ai_Interview_Platform.DSA.coding.dto.judge0;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Judge0ResponseDTO {

    private String stdout;
    private String stderr;
    
    @JsonProperty("compile_output")
    private String compileOutput;
    
    private String message;
    private String time;
    private Integer memory;
    private String token;
    private Judge0StatusDTO status;
}

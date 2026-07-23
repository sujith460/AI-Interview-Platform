package com.Ai_Interview_Platform.DSA.coding.dto.piston;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class RunDTO {

    private String stdout;

    private String stderr;

    private Integer code;

    private String signal;

    private String output;

}

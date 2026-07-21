package com.Ai_Interview_Platform.DSA.dto.piston;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RunDTO {

    private String stdout;

    private String stderr;

    private String output;

    private Integer code;

    private String signal;

}
package com.Ai_Interview_Platform.DSA.coding.dto.piston;

import lombok.Data;

import java.util.List;

@Data
public class PistonExecuteRequestDTO {

    private String language;

    private String version;

    private String stdin;

    private List<FileDTO> files;

}

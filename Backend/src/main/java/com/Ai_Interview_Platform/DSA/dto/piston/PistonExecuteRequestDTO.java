package com.Ai_Interview_Platform.DSA.dto.piston;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PistonExecuteRequestDTO {

    private String language;

    private String version;

    private List<FileDTO> files;

    private String stdin;

}
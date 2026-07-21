package com.Ai_Interview_Platform.DSA.dto.piston;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Response from Piston API execution.
 * <p>
 * For compiled languages (Java, C++, etc.), the {@code compile} field
 * captures the compilation phase. A non-zero exit code in
 * {@code compile.code} means compilation failed.
 * The {@code run} field captures the execution phase after a successful
 * compilation, or the runtime phase for interpreted languages.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PistonExecuteResponseDTO {

    private String language;

    private String version;

    private RunDTO compile;

    private RunDTO run;

}
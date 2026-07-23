package com.Ai_Interview_Platform.DSA.languagetemplate.dto;

import com.Ai_Interview_Platform.DSA.common.enums.ProgrammingLanguage;
import lombok.Data;

@Data
public class LanguageTemplateUpdateDTO {

    private ProgrammingLanguage language;

    private String starterCode;

    private String driverCode;

}

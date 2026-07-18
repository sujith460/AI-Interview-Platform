package com.Ai_Interview_Platform.DSA.dto.languagetemplate;

import com.Ai_Interview_Platform.DSA.entity.enums.ProgrammingLanguage;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LanguageTemplateUpdateDTO {

    private ProgrammingLanguage language;

    private String starterCode;

    private String driverCode;

}
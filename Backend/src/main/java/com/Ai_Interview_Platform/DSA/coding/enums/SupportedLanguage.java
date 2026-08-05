package com.Ai_Interview_Platform.DSA.coding.enums;

import lombok.Getter;

@Getter
public enum SupportedLanguage {

    JAVA("java", 62),
    PYTHON("python", 71),
    CPP("c++", 54),
    JAVASCRIPT("javascript", 63),
    GO("go", 60);

    private final String languageName;
    private final int judge0LanguageId;

    SupportedLanguage(String languageName, int judge0LanguageId) {
        this.languageName = languageName;
        this.judge0LanguageId = judge0LanguageId;
    }

    public static SupportedLanguage from(String language) {
        try {
            return SupportedLanguage.valueOf(language.toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new RuntimeException("Unsupported language : " + language);
        }
    }
}

package com.Ai_Interview_Platform.DSA.coding.enums;

import lombok.Getter;

@Getter
public enum SupportedLanguage {

    JAVA("java", "15"),
    PYTHON("python", "3.12.0"),
    CPP("c++", "10.0.5"),
    JAVASCRIPT("javascript", "18");

    private final String pistonLanguage;
    private final String version;

    SupportedLanguage(String pistonLanguage, String version) {
        this.pistonLanguage = pistonLanguage;
        this.version = version;
    }

    public static SupportedLanguage from(String language) {

        try {
            return SupportedLanguage.valueOf(language.toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new RuntimeException("Unsupported language : " + language);
        }

    }

}

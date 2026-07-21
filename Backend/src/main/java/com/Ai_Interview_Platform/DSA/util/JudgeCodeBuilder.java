package com.Ai_Interview_Platform.DSA.util;

import org.springframework.stereotype.Component;

@Component
public class JudgeCodeBuilder {

    public String buildCode(String userCode, String driverCode) {

        return userCode
                + System.lineSeparator()
                + System.lineSeparator()
                + driverCode;

    }

}
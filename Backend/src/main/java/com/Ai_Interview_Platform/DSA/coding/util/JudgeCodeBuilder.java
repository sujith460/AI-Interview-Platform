package com.Ai_Interview_Platform.DSA.coding.util;

import com.Ai_Interview_Platform.DSA.common.enums.ProgrammingLanguage;
import org.springframework.stereotype.Component;

@Component
public class JudgeCodeBuilder {

    public String buildCode(String userCode, String driverCode, ProgrammingLanguage language) {
        if (language == ProgrammingLanguage.JAVA || language == ProgrammingLanguage.KOTLIN) {
            return buildJavaCode(userCode, driverCode);
        } else if (language == ProgrammingLanguage.CPP || language == ProgrammingLanguage.C) {
            return buildCppCode(userCode, driverCode);
        }
        return userCode
                + System.lineSeparator()
                + System.lineSeparator()
                + driverCode;
    }

    private String buildJavaCode(String userCode, String driverCode) {
        StringBuilder imports = new StringBuilder();
        StringBuilder remainingDriver = new StringBuilder();

        if (driverCode != null) {
            String[] lines = driverCode.split("\\r?\\n");
            for (String line : lines) {
                String trimmed = line.trim();
                if (trimmed.startsWith("import ") && trimmed.endsWith(";")) {
                    imports.append(line).append(System.lineSeparator());
                } else {
                    remainingDriver.append(line).append(System.lineSeparator());
                }
            }
        }

        String importsStr = imports.toString().trim();
        String driverStr = remainingDriver.toString().trim();

        String result = "";
        if (!importsStr.isEmpty()) {
            result += importsStr + System.lineSeparator() + System.lineSeparator();
        }
        result += userCode;
        if (!driverStr.isEmpty()) {
            result += System.lineSeparator() + System.lineSeparator() + driverStr;
        }
        return result + System.lineSeparator();
    }

    private String buildCppCode(String userCode, String driverCode) {
        StringBuilder headers = new StringBuilder();
        StringBuilder remainingDriver = new StringBuilder();

        if (driverCode != null) {
            String[] lines = driverCode.split("\\r?\\n");
            for (String line : lines) {
                String trimmed = line.trim();
                if (trimmed.startsWith("#include") || trimmed.startsWith("using namespace ")) {
                    headers.append(line).append(System.lineSeparator());
                } else {
                    remainingDriver.append(line).append(System.lineSeparator());
                }
            }
        }

        String headersStr = headers.toString().trim();
        String driverStr = remainingDriver.toString().trim();

        String result = "";
        if (!headersStr.isEmpty()) {
            result += headersStr + System.lineSeparator() + System.lineSeparator();
        }
        result += userCode;
        if (!driverStr.isEmpty()) {
            result += System.lineSeparator() + System.lineSeparator() + driverStr;
        }
        return result + System.lineSeparator();
    }
}

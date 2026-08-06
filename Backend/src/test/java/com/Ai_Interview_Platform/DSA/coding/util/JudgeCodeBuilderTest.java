package com.Ai_Interview_Platform.DSA.coding.util;

import com.Ai_Interview_Platform.DSA.common.enums.ProgrammingLanguage;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertEquals;

public class JudgeCodeBuilderTest {

    private final JudgeCodeBuilder judgeCodeBuilder = new JudgeCodeBuilder();

    @Test
    public void testJavaCodeBuilding() {
        String userCode = "class Solution {\n    public boolean isPalindrome(String s) {\n        return true;\n    }\n}";
        String driverCode = "import java.io.*;\nimport java.util.*;\n\nclass ListNode {\n    int val;\n}";

        String result = judgeCodeBuilder.buildCode(userCode, driverCode, ProgrammingLanguage.JAVA);

        String expected = "import java.io.*;" + System.lineSeparator() +
                "import java.util.*;" + System.lineSeparator() +
                System.lineSeparator() +
                "class Solution {\n    public boolean isPalindrome(String s) {\n        return true;\n    }\n}" +
                System.lineSeparator() +
                System.lineSeparator() +
                "class ListNode {" + System.lineSeparator() +
                "    int val;" + System.lineSeparator() +
                "}" + System.lineSeparator();

        assertEquals(expected, result);
    }

    @Test
    public void testCppCodeBuilding() {
        String userCode = "class Solution {\npublic:\n    bool isPalindrome(string s) {\n        return true;\n    }\n};";
        String driverCode = "#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {}";

        String result = judgeCodeBuilder.buildCode(userCode, driverCode, ProgrammingLanguage.CPP);

        String expected = "#include <iostream>" + System.lineSeparator() +
                "#include <vector>" + System.lineSeparator() +
                "using namespace std;" + System.lineSeparator() +
                System.lineSeparator() +
                "class Solution {\npublic:\n    bool isPalindrome(string s) {\n        return true;\n    }\n};" +
                System.lineSeparator() +
                System.lineSeparator() +
                "int main() {}" + System.lineSeparator();

        assertEquals(expected, result);
    }

    @Test
    public void testPythonCodeBuilding() {
        String userCode = "class Solution:\n    def isPalindrome(self, s):\n        return True";
        String driverCode = "import sys\nprint('hello')";

        String result = judgeCodeBuilder.buildCode(userCode, driverCode, ProgrammingLanguage.PYTHON);

        String expected = "class Solution:\n    def isPalindrome(self, s):\n        return True" +
                System.lineSeparator() +
                System.lineSeparator() +
                "import sys\nprint('hello')";

        assertEquals(expected, result);
    }
}

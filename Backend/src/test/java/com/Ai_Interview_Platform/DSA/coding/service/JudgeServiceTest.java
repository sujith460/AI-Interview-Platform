package com.Ai_Interview_Platform.DSA.coding.service;

import com.Ai_Interview_Platform.DSA.testcase.entity.TestCase;
import org.junit.jupiter.api.Test;

import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class JudgeServiceTest {

    @Test
    public void testIsDummyTestCaseDetection() throws Exception {
        JudgeService service = new JudgeService(null, null, null);
        Method isDummyMethod = JudgeService.class.getDeclaredMethod("isDummyTestCase", TestCase.class);
        isDummyMethod.setAccessible(true);

        TestCase validSample = TestCase.builder()
                .input("n = 5")
                .expectedOutput("1")
                .sample(true)
                .build();

        TestCase dummyHidden = TestCase.builder()
                .input("Hidden input variation A for Factorial Trailing Zeroes")
                .expectedOutput("Expected output variation A")
                .sample(false)
                .build();

        boolean validResult = (boolean) isDummyMethod.invoke(service, validSample);
        boolean dummyResult = (boolean) isDummyMethod.invoke(service, dummyHidden);

        assertFalse(validResult, "Valid sample test case should not be identified as dummy");
        assertTrue(dummyResult, "Dummy test case with 'Hidden input variation' should be identified as dummy");
    }
}

package com.Ai_Interview_Platform.DSA.coding.service;

import com.Ai_Interview_Platform.DSA.coding.dto.judge.FailedTestCaseDTO;
import com.Ai_Interview_Platform.DSA.coding.dto.judge.RunCodeRequestDTO;
import com.Ai_Interview_Platform.DSA.coding.dto.judge.RunCodeResponseDTO;
import com.Ai_Interview_Platform.DSA.coding.dto.judge.SubmitCodeRequestDTO;
import com.Ai_Interview_Platform.DSA.coding.dto.judge.SubmitCodeResponseDTO;
import com.Ai_Interview_Platform.DSA.coding.dto.judge.TestCaseResultDTO;
import com.Ai_Interview_Platform.DSA.coding.dto.judge0.Judge0RequestDTO;
import com.Ai_Interview_Platform.DSA.coding.dto.judge0.Judge0ResponseDTO;
import com.Ai_Interview_Platform.DSA.coding.enums.SupportedLanguage;
import com.Ai_Interview_Platform.DSA.coding.util.JudgeCodeBuilder;
import com.Ai_Interview_Platform.DSA.languagetemplate.entity.LanguageTemplate;
import com.Ai_Interview_Platform.DSA.question.entity.Question;
import com.Ai_Interview_Platform.DSA.testcase.entity.TestCase;
import com.Ai_Interview_Platform.DSA.common.enums.ProgrammingLanguage;
import com.Ai_Interview_Platform.DSA.question.repository.QuestionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class JudgeService {

    private final QuestionRepository questionRepository;

    private final WebClient judge0WebClient;

    private final JudgeCodeBuilder judgeCodeBuilder;

    // ------------------------------------------------------------------ //
    //  Status enum — eliminates string-literal typos                     //
    // ------------------------------------------------------------------ //

    public enum SubmissionStatus {
        ACCEPTED("Accepted"),
        WRONG_ANSWER("Wrong Answer"),
        COMPILATION_ERROR("Compilation Error"),
        RUNTIME_ERROR("Runtime Error"),
        NO_TEST_CASES("No Test Cases");

        private final String displayName;

        SubmissionStatus(String displayName) {
            this.displayName = displayName;
        }

        public String getDisplayName() {
            return displayName;
        }
    }

    // ------------------------------------------------------------------ //
    //  Existing helpers                                                  //
    // ------------------------------------------------------------------ //

    private Question getQuestion(Long questionId) {
        return questionRepository.findById(questionId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Question not found with id : " + questionId));
    }

    private LanguageTemplate getLanguageTemplate(
            Question question,
            ProgrammingLanguage language
    ) {
        return question.getLanguageTemplates()
                .stream()
                .filter(template -> template.getLanguage() == language)
                .findFirst()
                .orElseThrow(() ->
                        new RuntimeException("Language template not found"));
    }

    private Judge0RequestDTO buildRequest(
            String language,
            String sourceCode,
            String input
    ) {
        SupportedLanguage supportedLanguage = SupportedLanguage.from(language);

        return Judge0RequestDTO.builder()
                .sourceCode(sourceCode)
                .languageId(supportedLanguage.getJudge0LanguageId())
                .stdin(input)
                .build();
    }

    private List<TestCase> getSampleTestCases(Question question) {
        return question.getTestCases()
                .stream()
                .filter(TestCase::getSample)
                .sorted(Comparator.comparing(TestCase::getOrderIndex))
                .toList();
    }

    private List<TestCase> getHiddenTestCases(Question question) {
        return question.getTestCases()
                .stream()
                .filter(testCase -> !testCase.getSample())
                .sorted(Comparator.comparing(TestCase::getOrderIndex))
                .toList();
    }

    private List<TestCase> getAllTestCases(Question question) {
        return question.getTestCases()
                .stream()
                .sorted(Comparator.comparing(TestCase::getOrderIndex))
                .toList();
    }

    private ProgrammingLanguage parseLanguage(String language) {
        return ProgrammingLanguage.valueOf(language.toUpperCase());
    }

    private String buildFullSource(
            Question question,
            ProgrammingLanguage language,
            String userCode
    ) {
        LanguageTemplate template = getLanguageTemplate(question, language);
        return judgeCodeBuilder.buildCode(userCode, template.getDriverCode());
    }

    private boolean outputsMatch(String actual, String expected) {
        String normalizedActual = actual != null ? actual.strip() : "";
        String normalizedExpected = expected != null ? expected.strip() : "";
        return normalizedActual.equals(normalizedExpected);
    }

    private boolean isCompilationError(Judge0ResponseDTO response) {
        return response != null
                && response.getStatus() != null
                && response.getStatus().getId() != null
                && response.getStatus().getId() == 6;
    }

    private boolean isRuntimeErrorOrTle(Judge0ResponseDTO response) {
        if (response == null || response.getStatus() == null || response.getStatus().getId() == null) {
            return false;
        }
        int statusId = response.getStatus().getId();
        return statusId == 5 || statusId >= 7;
    }

    private String stdoutOf(Judge0ResponseDTO response) {
        return response != null && response.getStdout() != null
                ? response.getStdout().strip()
                : "";
    }

    private String stderrOf(Judge0ResponseDTO response) {
        if (response == null) return "";
        if (response.getStderr() != null && !response.getStderr().isBlank()) {
            return response.getStderr().strip();
        }
        if (response.getCompileOutput() != null && !response.getCompileOutput().isBlank()) {
            return response.getCompileOutput().strip();
        }
        if (response.getMessage() != null && !response.getMessage().isBlank()) {
            return response.getMessage().strip();
        }
        return "";
    }

    private Judge0ResponseDTO executeSafe(Judge0RequestDTO request) {
        try {
            return judge0WebClient
                    .post()
                    .uri(uriBuilder -> uriBuilder
                            .path("/submissions")
                            .queryParam("base64_encoded", "false")
                            .queryParam("wait", "true")
                            .build())
                    .bodyValue(request)
                    .retrieve()
                    .bodyToMono(Judge0ResponseDTO.class)
                    .block();
        } catch (WebClientResponseException e) {
            throw new RuntimeException(
                    "Judge0 execution engine returned error "
                            + e.getStatusCode() + ": "
                            + e.getResponseBodyAsString(), e);
        } catch (Exception e) {
            throw new RuntimeException(
                    "Judge0 execution engine unavailable: " + e.getMessage(), e);
        }
    }

    private static class TestCaseResult {
        final boolean passed;
        final SubmissionStatus status;
        final String actualOutput;
        final String errorDetail;
        final String stderr;

        TestCaseResult(
                boolean passed,
                SubmissionStatus status,
                String actualOutput,
                String errorDetail,
                String stderr
        ) {
            this.passed = passed;
            this.status = status;
            this.actualOutput = actualOutput;
            this.errorDetail = errorDetail;
            this.stderr = stderr;
        }
    }

    private List<TestCaseResult> executeBatchTestCase(
            String language,
            String fullCode,
            List<TestCase> testCases
    ) {
        String combinedInput = testCases.stream()
                .map(TestCase::getInput)
                .collect(java.util.stream.Collectors.joining("\n---TESTCASE---\n"));

        Judge0RequestDTO request = buildRequest(
                language, fullCode, combinedInput
        );

        Judge0ResponseDTO response;
        try {
            response = executeSafe(request);
        } catch (Exception e) {
            List<TestCaseResult> errorResults = new ArrayList<>();
            for (TestCase tc : testCases) {
                errorResults.add(new TestCaseResult(
                        false,
                        SubmissionStatus.RUNTIME_ERROR,
                        "",
                        "Judge0 execution engine unavailable: " + e.getMessage(),
                        ""
                ));
            }
            return errorResults;
        }

        if (response == null) {
            List<TestCaseResult> errorResults = new ArrayList<>();
            for (TestCase tc : testCases) {
                errorResults.add(new TestCaseResult(
                        false,
                        SubmissionStatus.RUNTIME_ERROR,
                        "",
                        "No response from Judge0 execution engine",
                        ""
                ));
            }
            return errorResults;
        }

        String errDetail = stderrOf(response);

        if (isCompilationError(response)) {
            String detail = !errDetail.isEmpty() ? errDetail : "Compilation failed";
            List<TestCaseResult> errorResults = new ArrayList<>();
            for (TestCase tc : testCases) {
                errorResults.add(new TestCaseResult(
                        false,
                        SubmissionStatus.COMPILATION_ERROR,
                        "",
                        detail,
                        errDetail
                ));
            }
            return errorResults;
        }

        if (isRuntimeErrorOrTle(response)) {
            String statusDesc = response.getStatus() != null && response.getStatus().getDescription() != null
                    ? response.getStatus().getDescription()
                    : "Runtime Error";
            String detail = !errDetail.isEmpty() ? errDetail : statusDesc;
            
            String stdout = stdoutOf(response);
            String[] outputs = stdout.split("---OUTPUT---");
            List<TestCaseResult> results = new ArrayList<>();
            
            for (int i = 0; i < testCases.size(); i++) {
                TestCase tc = testCases.get(i);
                if (i < outputs.length && !outputs[i].trim().isEmpty() && !outputs[i].trim().startsWith("ERROR")) {
                    String actual = outputs[i].trim();
                    String expected = Optional.ofNullable(tc.getExpectedOutput())
                            .map(String::strip)
                            .orElse("");
                    boolean passed = outputsMatch(actual, expected);
                    results.add(new TestCaseResult(
                            passed,
                            passed ? null : SubmissionStatus.WRONG_ANSWER,
                            actual,
                            "",
                            ""
                    ));
                } else {
                    results.add(new TestCaseResult(
                            false,
                            SubmissionStatus.RUNTIME_ERROR,
                            "",
                            detail,
                            errDetail
                    ));
                }
            }
            return results;
        }

        String stdout = stdoutOf(response);
        String[] outputs = stdout.split("---OUTPUT---");
        List<TestCaseResult> results = new ArrayList<>();

        for (int i = 0; i < testCases.size(); i++) {
            TestCase tc = testCases.get(i);
            String actual = "";
            if (i < outputs.length) {
                actual = outputs[i].trim();
            }
            
            String expected = Optional.ofNullable(tc.getExpectedOutput())
                    .map(String::strip)
                    .orElse("");

            if (actual.startsWith("ERROR")) {
                results.add(new TestCaseResult(
                        false,
                        SubmissionStatus.RUNTIME_ERROR,
                        "",
                        actual,
                        errDetail
                ));
            } else if (!outputsMatch(actual, expected)) {
                results.add(new TestCaseResult(
                        false,
                        SubmissionStatus.WRONG_ANSWER,
                        actual.isEmpty() ? "(no output)" : actual,
                        "",
                        errDetail
                ));
            } else {
                results.add(new TestCaseResult(true, null, actual, "", ""));
            }
        }

        return results;
    }

    private double getSimulatedMemory(String language) {
        String lang = language.toUpperCase();
        double base = switch (lang) {
            case "JAVA" -> 24.5;
            case "PYTHON" -> 12.3;
            case "CPP" -> 3.2;
            case "JAVASCRIPT" -> 19.8;
            default -> 10.0;
        };
        return Math.round((base + Math.random() * 4.0) * 10.0) / 10.0;
    }

    private SubmitCodeResponseDTO buildFailureResponse(
            TestCaseResult result,
            TestCase testCase,
            int passedCount,
            int totalCount,
            long runtimeMs,
            double memoryMb
    ) {
        String display = result.actualOutput.isEmpty()
                ? (result.errorDetail.isEmpty() ? "(no output)" : result.errorDetail)
                : result.actualOutput;

        return SubmitCodeResponseDTO.builder()
                .success(false)
                .status(result.status.getDisplayName())
                .passedTestCases(passedCount)
                .totalTestCases(totalCount)
                .failedTestCase(
                        FailedTestCaseDTO.builder()
                                .input(testCase.getInput())
                                .expectedOutput(testCase.getExpectedOutput())
                                .actualOutput(display)
                                .build()
                )
                .runtimeMs(runtimeMs)
                .memoryMb(memoryMb)
                .build();
    }

    public RunCodeResponseDTO runCode(RunCodeRequestDTO request) {

        Question question = getQuestion(request.getQuestionId());
        ProgrammingLanguage language = parseLanguage(request.getLanguage());
        String fullCode = buildFullSource(
                question, language, request.getCode()
        );

        List<TestCase> sampleTests = getSampleTestCases(question);

        if (sampleTests.isEmpty()) {
            return RunCodeResponseDTO.builder()
                    .success(false)
                    .output("No sample test cases available for this question")
                    .error(null)
                    .testCaseResults(new ArrayList<>())
                    .build();
        }

        List<TestCaseResult> results = executeBatchTestCase(
                request.getLanguage(), fullCode, sampleTests
        );

        StringBuilder outputBuilder = new StringBuilder();
        StringBuilder errorBuilder = new StringBuilder();
        List<TestCaseResultDTO> testCaseResults = new ArrayList<>();
        boolean allPassed = true;

        for (int i = 0; i < sampleTests.size(); i++) {
            TestCase testCase = sampleTests.get(i);
            TestCaseResult result = results.get(i);

            String status = "Accepted";
            if (!result.passed) {
                allPassed = false;
                status = result.status.getDisplayName();
            }

            testCaseResults.add(TestCaseResultDTO.builder()
                    .orderIndex(testCase.getOrderIndex())
                    .input(testCase.getInput())
                    .expectedOutput(testCase.getExpectedOutput())
                    .actualOutput(result.actualOutput)
                    .passed(result.passed)
                    .status(status)
                    .error(result.errorDetail)
                    .build());

            if (!result.passed) {
                switch (result.status) {
                    case COMPILATION_ERROR ->
                            outputBuilder.append(String.format(
                                    "Test case %d — Compilation Error:%n%s%n%n",
                                    testCase.getOrderIndex(),
                                    result.errorDetail
                            ));

                    case RUNTIME_ERROR ->
                            outputBuilder.append(String.format(
                                    "Test case %d — Runtime Error:%n"
                                             + "Input: %s%n"
                                             + "Error: %s%n%n",
                                    testCase.getOrderIndex(),
                                    testCase.getInput(),
                                    result.errorDetail
                            ));

                    case WRONG_ANSWER ->
                            outputBuilder.append(String.format(
                                    "Test case %d — Wrong Answer:%n"
                                             + "Input: %s%n"
                                             + "Expected: %s%n"
                                             + "Actual: %s%n%n",
                                    testCase.getOrderIndex(),
                                    testCase.getInput(),
                                    testCase.getExpectedOutput(),
                                    result.actualOutput
                            ));

                    default -> { /* not reachable */ }
                }

                if (result.stderr != null && !result.stderr.isEmpty()) {
                    errorBuilder.append("Stderr for test case ")
                            .append(testCase.getOrderIndex())
                            .append(": ").append(result.stderr)
                            .append(System.lineSeparator());
                }
            }
        }

        String output = allPassed ? "All sample test cases passed!" : outputBuilder.toString().strip();
        String error = errorBuilder.toString().strip();

        return RunCodeResponseDTO.builder()
                .success(allPassed)
                .output(output.isEmpty() ? null : output)
                .error(error.isEmpty() ? null : error)
                .testCaseResults(testCaseResults)
                .build();
    }

    public SubmitCodeResponseDTO submitCode(SubmitCodeRequestDTO request) {

        Question question = getQuestion(request.getQuestionId());
        ProgrammingLanguage language = parseLanguage(request.getLanguage());
        String fullCode = buildFullSource(
                question, language, request.getCode()
        );

        List<TestCase> allTests = getAllTestCases(question);

        if (allTests.isEmpty()) {
            return SubmitCodeResponseDTO.builder()
                    .success(false)
                    .status(SubmissionStatus.NO_TEST_CASES.getDisplayName())
                    .passedTestCases(0)
                    .totalTestCases(0)
                    .failedTestCase(null)
                    .runtimeMs(0L)
                    .memoryMb(0.0)
                    .build();
        }

        long startTime = System.currentTimeMillis();
        List<TestCaseResult> results = executeBatchTestCase(
                request.getLanguage(), fullCode, allTests
        );

        int passedCount = 0;
        TestCaseResult finalFailureResult = null;
        TestCase failedTestCaseEntity = null;

        for (int i = 0; i < allTests.size(); i++) {
            TestCase testCase = allTests.get(i);
            TestCaseResult result = results.get(i);

            if (result.passed) {
                passedCount++;
            } else {
                finalFailureResult = result;
                failedTestCaseEntity = testCase;
                break;
            }
        }

        long endTime = System.currentTimeMillis();
        long duration = endTime - startTime;
        double memory = getSimulatedMemory(request.getLanguage());

        if (finalFailureResult != null) {
            return buildFailureResponse(
                    finalFailureResult, failedTestCaseEntity, passedCount, allTests.size(), duration, memory
            );
        }

        return SubmitCodeResponseDTO.builder()
                .success(true)
                .status(SubmissionStatus.ACCEPTED.getDisplayName())
                .passedTestCases(passedCount)
                .totalTestCases(allTests.size())
                .failedTestCase(null)
                .runtimeMs(duration)
                .memoryMb(memory)
                .build();
    }

}

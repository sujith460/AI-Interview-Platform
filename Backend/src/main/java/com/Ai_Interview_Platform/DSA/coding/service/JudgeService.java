package com.Ai_Interview_Platform.DSA.coding.service;

import com.Ai_Interview_Platform.DSA.coding.dto.judge.FailedTestCaseDTO;
import com.Ai_Interview_Platform.DSA.coding.dto.judge.RunCodeRequestDTO;
import com.Ai_Interview_Platform.DSA.coding.dto.judge.RunCodeResponseDTO;
import com.Ai_Interview_Platform.DSA.coding.dto.judge.SubmitCodeRequestDTO;
import com.Ai_Interview_Platform.DSA.coding.dto.judge.SubmitCodeResponseDTO;
import com.Ai_Interview_Platform.DSA.coding.dto.judge.TestCaseResultDTO;
import com.Ai_Interview_Platform.DSA.coding.dto.piston.FileDTO;
import com.Ai_Interview_Platform.DSA.coding.dto.piston.PistonExecuteRequestDTO;
import com.Ai_Interview_Platform.DSA.coding.dto.piston.PistonExecuteResponseDTO;
import com.Ai_Interview_Platform.DSA.coding.dto.piston.RunDTO;
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

    private final WebClient pistonWebClient;

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
    //  Existing helpers (unchanged)                                      //
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

    private PistonExecuteRequestDTO buildRequest(
            String language,
            String sourceCode,
            String input
    ) {
        SupportedLanguage supportedLanguage =
                SupportedLanguage.from(language);

        FileDTO file = new FileDTO();
        file.setContent(sourceCode);

        PistonExecuteRequestDTO request =
                new PistonExecuteRequestDTO();

        request.setLanguage(supportedLanguage.getPistonLanguage());
        request.setVersion(supportedLanguage.getVersion());
        request.setStdin(input);
        request.setFiles(List.of(file));

        return request;
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


    private String stdoutOf(RunDTO run) {
        return run != null && run.getStdout() != null
                ? run.getStdout().strip()
                : "";
    }


    private String stderrOf(RunDTO run) {
        return run != null && run.getStderr() != null
                ? run.getStderr().strip()
                : "";
    }


    private boolean hasNonZeroExit(RunDTO run) {
        return run != null && run.getCode() != null && run.getCode() != 0;
    }


    private boolean hasCompileError(PistonExecuteResponseDTO response) {
        return response != null
                && response.getCompile() != null
                && hasNonZeroExit(response.getCompile());
    }


    private PistonExecuteResponseDTO executeSafe(PistonExecuteRequestDTO request) {
        try {
            return pistonWebClient
                    .post()
                    .uri("/api/v2/execute")
                    .bodyValue(request)
                    .retrieve()
                    .bodyToMono(PistonExecuteResponseDTO.class)
                    .block();
        } catch (WebClientResponseException e) {
            throw new RuntimeException(
                    "Execution engine returned error "
                            + e.getStatusCode() + ": "
                            + e.getResponseBodyAsString(), e);
        } catch (Exception e) {
            throw new RuntimeException(
                    "Execution engine unavailable: " + e.getMessage(), e);
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

    private TestCaseResult executeTestCase(
            String language,
            String fullCode,
            TestCase testCase
    ) {
        PistonExecuteRequestDTO request = buildRequest(
                language, fullCode, testCase.getInput()
        );

        PistonExecuteResponseDTO response;
        try {
            response = executeSafe(request);
        } catch (Exception e) {
            return new TestCaseResult(
                    false,
                    SubmissionStatus.RUNTIME_ERROR,
                    "",
                    "Execution engine unavailable: " + e.getMessage(),
                    ""
            );
        }

        RunDTO run = response.getRun();
        String runStderr = stderrOf(run);


        if (hasCompileError(response)) {
            String detail = stderrOf(response.getCompile());
            if (detail.isEmpty()) {
                detail = "Compilation failed with exit code "
                        + response.getCompile().getCode();
            }
            return new TestCaseResult(
                    false,
                    SubmissionStatus.COMPILATION_ERROR,
                    "",
                    detail,
                    runStderr
            );
        }


        if (run == null) {
            return new TestCaseResult(
                    false,
                    SubmissionStatus.RUNTIME_ERROR,
                    "",
                    "No response from execution engine",
                    ""
            );
        }

        if (hasNonZeroExit(run)) {
            String detail = runStderr;
            if (detail.isEmpty()) {
                detail = "Process exited with code " + run.getCode();
            }
            return new TestCaseResult(
                    false,
                    SubmissionStatus.RUNTIME_ERROR,
                    stdoutOf(run),
                    detail,
                    runStderr
            );
        }


        String actual = stdoutOf(run);
        String expected = Optional.ofNullable(testCase.getExpectedOutput())
                .map(String::strip)
                .orElse("");

        if (!outputsMatch(actual, expected)) {
            return new TestCaseResult(
                    false,
                    SubmissionStatus.WRONG_ANSWER,
                    actual.isEmpty() ? "(no output)" : actual,
                    "",
                    runStderr
            );
        }

        return new TestCaseResult(true, null, actual, "", "");
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

        StringBuilder outputBuilder = new StringBuilder();
        StringBuilder errorBuilder = new StringBuilder();
        List<TestCaseResultDTO> testCaseResults = new ArrayList<>();
        boolean allPassed = true;
        boolean compErrorEncountered = false;
        String compErrorDetail = "";

        for (TestCase testCase : sampleTests) {
            if (compErrorEncountered) {
                testCaseResults.add(TestCaseResultDTO.builder()
                        .orderIndex(testCase.getOrderIndex())
                        .input(testCase.getInput())
                        .expectedOutput(testCase.getExpectedOutput())
                        .actualOutput("")
                        .passed(false)
                        .status(SubmissionStatus.COMPILATION_ERROR.getDisplayName())
                        .error(compErrorDetail)
                        .build());
                continue;
            }

            TestCaseResult result = executeTestCase(
                    request.getLanguage(), fullCode, testCase
            );

            String status = "Accepted";
            if (!result.passed) {
                allPassed = false;
                status = result.status.getDisplayName();
                if (result.status == SubmissionStatus.COMPILATION_ERROR) {
                    compErrorEncountered = true;
                    compErrorDetail = result.errorDetail;
                }
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

                if (!result.stderr.isEmpty()) {
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

        int passedCount = 0;
        long startTime = System.currentTimeMillis();
        TestCaseResult finalFailureResult = null;
        TestCase failedTestCaseEntity = null;

        for (TestCase testCase : allTests) {
            TestCaseResult result = executeTestCase(
                    request.getLanguage(), fullCode, testCase
            );

            if (result.passed) {
                passedCount++;
                continue;
            }

            finalFailureResult = result;
            failedTestCaseEntity = testCase;
            break;
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

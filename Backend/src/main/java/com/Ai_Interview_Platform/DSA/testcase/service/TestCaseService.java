package com.Ai_Interview_Platform.DSA.testcase.service;

import com.Ai_Interview_Platform.DSA.question.entity.Question;
import com.Ai_Interview_Platform.DSA.question.repository.QuestionRepository;
import com.Ai_Interview_Platform.DSA.testcase.dto.TestCaseRequestDTO;
import com.Ai_Interview_Platform.DSA.testcase.dto.TestCaseResponseDTO;
import com.Ai_Interview_Platform.DSA.testcase.dto.TestCaseUpdateDTO;
import com.Ai_Interview_Platform.DSA.testcase.entity.TestCase;
import com.Ai_Interview_Platform.DSA.testcase.mapper.TestCaseMapper;
import com.Ai_Interview_Platform.DSA.testcase.repository.TestCaseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TestCaseService {

    private final TestCaseRepository testCaseRepository;
    private final QuestionRepository questionRepository;
    private final TestCaseMapper testCaseMapper;

    public TestCaseResponseDTO createTestCase(TestCaseRequestDTO request) {

        Question question = questionRepository.findById(request.getQuestionId())
                .orElseThrow(() ->
                        new RuntimeException("Question not found"));

        if (testCaseRepository.existsByQuestionIdAndOrderIndex(
                request.getQuestionId(),
                request.getOrderIndex())) {

            throw new RuntimeException(
                    "Order index already exists for this question");
        }

        TestCase testCase = testCaseMapper.toEntity(request);

        testCase.setQuestion(question);

        TestCase savedTestCase = testCaseRepository.save(testCase);

        return buildResponse(savedTestCase);

    }

    public List<TestCaseResponseDTO> getSampleTestCases(Long questionId) {

        return testCaseRepository
                .findByQuestionIdAndSampleTrueOrderByOrderIndexAsc(questionId)
                .stream()
                .map(this::buildResponse)
                .toList();

    }

    public List<TestCaseResponseDTO> getAllTestCases(Long questionId) {

        return testCaseRepository
                .findByQuestionIdOrderByOrderIndexAsc(questionId)
                .stream()
                .map(this::buildResponse)
                .toList();

    }

    public TestCaseResponseDTO updateTestCase(
            Long id,
            TestCaseUpdateDTO request
    ) {

        TestCase testCase = testCaseRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Test case not found"));

        if (request.getOrderIndex() != null &&
                testCaseRepository.existsByQuestionIdAndOrderIndexAndIdNot(
                        testCase.getQuestion().getId(),
                        request.getOrderIndex(),
                        id)) {

            throw new RuntimeException(
                    "Order index already exists for this question");
        }

        testCaseMapper.updateTestCaseFromDto(request, testCase);

        TestCase updatedTestCase = testCaseRepository.save(testCase);

        return buildResponse(updatedTestCase);

    }

    public void deleteTestCase(Long id) {

        TestCase testCase = testCaseRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Test case not found"));

        testCaseRepository.delete(testCase);

    }

    private TestCaseResponseDTO buildResponse(TestCase testCase) {

        return testCaseMapper.toResponse(testCase);

    }

}

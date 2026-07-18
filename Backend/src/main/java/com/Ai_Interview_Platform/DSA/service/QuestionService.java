package com.Ai_Interview_Platform.DSA.service;

import com.Ai_Interview_Platform.DSA.dto.common.PagedResponse;
import com.Ai_Interview_Platform.DSA.dto.question.*;
import com.Ai_Interview_Platform.DSA.dto.testcase.TestCaseResponseDTO;
import com.Ai_Interview_Platform.DSA.entity.Company;
import com.Ai_Interview_Platform.DSA.entity.Pattern;
import com.Ai_Interview_Platform.DSA.entity.Question;
import com.Ai_Interview_Platform.DSA.entity.enums.Difficulty;
import com.Ai_Interview_Platform.DSA.entity.enums.SortDirection;
import com.Ai_Interview_Platform.DSA.mapper.QuestionDetailsMapper;
import com.Ai_Interview_Platform.DSA.mapper.QuestionMapper;
import com.Ai_Interview_Platform.DSA.repository.CompanyRepository;
import com.Ai_Interview_Platform.DSA.repository.PatternRepository;
import com.Ai_Interview_Platform.DSA.repository.QuestionRepository;
import com.Ai_Interview_Platform.DSA.specification.QuestionSpecification;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QuestionService {

    private final QuestionRepository questionRepository;
    private final CompanyRepository companyRepository;
    private final PatternRepository patternRepository;
    private final QuestionMapper questionMapper;
    private final QuestionDetailsMapper questionDetailsMapper;

    public QuestionResponseDTO createQuestion(QuestionRequestDTO request) {

        if (questionRepository.existsByTitle(request.getTitle())) {
            throw new RuntimeException("Question already exists");
        }

        Question question = questionMapper.toEntity(request);

        question.setSlug(generateSlug(request.getTitle()));

        if (request.getCompanyIds() != null && !request.getCompanyIds().isEmpty()) {

            Set<Company> companies = new HashSet<>(
                    companyRepository.findAllById(request.getCompanyIds())
            );

            question.setCompanies(companies);
        }

        if (request.getPatternIds() != null && !request.getPatternIds().isEmpty()) {

            Set<Pattern> patterns = new HashSet<>(
                    patternRepository.findAllById(request.getPatternIds())
            );

            question.setPatterns(patterns);
        }

        Question savedQuestion = questionRepository.save(question);

        return buildResponse(savedQuestion);

    }
    public List<QuestionResponseDTO> getAllQuestions() {

        return questionRepository.findAll()
                .stream()
                .map(this::buildResponse)
                .toList();

    }

    public QuestionResponseDTO getQuestionById(Long id) {

        Question question = questionRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Question not found"));

        return buildResponse(question);

    }

    public QuestionResponseDTO getQuestionBySlug(String slug) {

        Question question = questionRepository.findDetailsBySlug(slug)
                .orElseThrow(() ->
                        new RuntimeException("Question not found"));

        return buildResponse(question);

    }


    public QuestionResponseDTO updateQuestion(
            Long id,
            @Valid QuestionUpdateDTO request
    ) {

        Question question = questionRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Question not found"));

        if (request.getTitle() != null &&
                !request.getTitle().equals(question.getTitle())) {

            if (questionRepository.existsByTitle(request.getTitle())) {
                throw new RuntimeException("Question already exists");
            }

            question.setSlug(generateSlug(request.getTitle()));
        }

        questionMapper.updateQuestionFromDto(request, question);

        if (request.getCompanyIds() != null) {

            Set<Company> companies = new HashSet<>(
                    companyRepository.findAllById(request.getCompanyIds())
            );

            question.setCompanies(companies);

        }

        if (request.getPatternIds() != null) {

            Set<Pattern> patterns = new HashSet<>(
                    patternRepository.findAllById(request.getPatternIds())
            );

            question.setPatterns(patterns);

        }

        Question updatedQuestion =
                questionRepository.save(question);

        return buildResponse(updatedQuestion);

    }

    public void deleteQuestion(Long id) {

        Question question = questionRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Question not found"));

        questionRepository.delete(question);

    }

    public PagedResponse<QuestionResponseDTO> searchQuestions(
            QuestionSearchRequestDTO request) {

        Sort sort = request.getSortDirection() == SortDirection.ASC
                ? Sort.by(request.getSortBy().getField()).ascending()
                : Sort.by(request.getSortBy().getField()).descending();

        Pageable pageable = PageRequest.of(
                request.getPage(),
                request.getSize(),
                sort
        );

        Specification<Question> specification =
                QuestionSpecification.buildSpecification(request);

        Page<Question> questionPage =
                questionRepository.findAll(specification, pageable);

        List<QuestionResponseDTO> response =
                questionPage.getContent()
                        .stream()
                        .map(this::buildResponse)
                        .toList();

        return new PagedResponse<>(
                response,
                questionPage.getNumber(),
                questionPage.getSize(),
                questionPage.getTotalElements(),
                questionPage.getTotalPages(),
                questionPage.isFirst(),
                questionPage.isLast()
        );

    }

    private String generateSlug(String title) {

        return title.toLowerCase()
                .trim()
                .replaceAll("[^a-z0-9\\s]", "")
                .replaceAll("\\s+", "-");

    }

    private QuestionResponseDTO buildResponse(Question question) {

        return questionMapper.toResponse(question);

    }

    public QuestionDetailsResponseDTO getQuestionDetails(String slug){
        Question question = questionRepository.findDetailsBySlug(slug)
                .orElseThrow(() ->
                        new IllegalArgumentException("Question not found with slug : " + slug));

        QuestionDetailsResponseDTO response =
                questionDetailsMapper.toResponse(question);

        response.setSampleTestCases(

                response.getSampleTestCases()
                        .stream()
                        .filter(TestCaseResponseDTO::getSample)
                        .collect(Collectors.toSet())

        );

        return response;
    }
}
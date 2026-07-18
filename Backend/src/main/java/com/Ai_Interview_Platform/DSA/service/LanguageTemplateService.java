package com.Ai_Interview_Platform.DSA.service;

import com.Ai_Interview_Platform.DSA.dto.languagetemplate.LanguageTemplateRequestDTO;
import com.Ai_Interview_Platform.DSA.dto.languagetemplate.LanguageTemplateResponseDTO;
import com.Ai_Interview_Platform.DSA.dto.languagetemplate.LanguageTemplateUpdateDTO;
import com.Ai_Interview_Platform.DSA.entity.LanguageTemplate;
import com.Ai_Interview_Platform.DSA.entity.Question;
import com.Ai_Interview_Platform.DSA.entity.enums.ProgrammingLanguage;
import com.Ai_Interview_Platform.DSA.mapper.LanguageTemplateMapper;
import com.Ai_Interview_Platform.DSA.repository.LanguageTemplateRepository;
import com.Ai_Interview_Platform.DSA.repository.QuestionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LanguageTemplateService {

    private final LanguageTemplateRepository languageTemplateRepository;
    private final QuestionRepository questionRepository;
    private final LanguageTemplateMapper languageTemplateMapper;

    public LanguageTemplateResponseDTO createLanguageTemplate(
            LanguageTemplateRequestDTO request) {

        Question question = questionRepository.findById(request.getQuestionId())
                .orElseThrow(() ->
                        new RuntimeException("Question not found"));

        if (languageTemplateRepository.existsByQuestionIdAndLanguage(
                request.getQuestionId(),
                request.getLanguage())) {

            throw new RuntimeException(
                    "Language template already exists for this question");
        }

        LanguageTemplate languageTemplate =
                languageTemplateMapper.toEntity(request);

        languageTemplate.setQuestion(question);

        LanguageTemplate savedLanguageTemplate =
                languageTemplateRepository.save(languageTemplate);

        return buildResponse(savedLanguageTemplate);

    }

    public List<LanguageTemplateResponseDTO> getAllLanguageTemplates(
            Long questionId) {

        return languageTemplateRepository.findByQuestionId(questionId)
                .stream()
                .map(this::buildResponse)
                .toList();

    }

    public LanguageTemplateResponseDTO getLanguageTemplate(
            Long questionId,
            ProgrammingLanguage language) {

        LanguageTemplate languageTemplate =
                languageTemplateRepository
                        .findByQuestionIdAndLanguage(questionId, language)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Language template not found"));

        return buildResponse(languageTemplate);

    }

    public LanguageTemplateResponseDTO updateLanguageTemplate(
            Long id,
            LanguageTemplateUpdateDTO request) {

        LanguageTemplate languageTemplate =
                languageTemplateRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Language template not found"));

        if (request.getLanguage() != null &&
                request.getLanguage() != languageTemplate.getLanguage() &&
                languageTemplateRepository.existsByQuestionIdAndLanguage(
                        languageTemplate.getQuestion().getId(),
                        request.getLanguage())) {

            throw new RuntimeException(
                    "Language template already exists for this question");
        }

        languageTemplateMapper.updateLanguageTemplateFromDto(
                request,
                languageTemplate);

        LanguageTemplate updatedLanguageTemplate =
                languageTemplateRepository.save(languageTemplate);

        return buildResponse(updatedLanguageTemplate);

    }

    public void deleteLanguageTemplate(Long id) {

        LanguageTemplate languageTemplate =
                languageTemplateRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Language template not found"));

        languageTemplateRepository.delete(languageTemplate);

    }

    private LanguageTemplateResponseDTO buildResponse(
            LanguageTemplate languageTemplate) {

        return languageTemplateMapper.toResponse(languageTemplate);

    }

}
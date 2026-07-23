package com.Ai_Interview_Platform.DSA.languagetemplate.repository;

import com.Ai_Interview_Platform.DSA.languagetemplate.entity.LanguageTemplate;
import com.Ai_Interview_Platform.DSA.common.enums.ProgrammingLanguage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface LanguageTemplateRepository
        extends JpaRepository<LanguageTemplate, Long> {

    List<LanguageTemplate> findByQuestionId(Long questionId);

    Optional<LanguageTemplate> findByQuestionIdAndLanguage(
            Long questionId,
            ProgrammingLanguage language
    );

    boolean existsByQuestionIdAndLanguage(
            Long questionId,
            ProgrammingLanguage language
    );

}

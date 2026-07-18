package com.Ai_Interview_Platform.DSA.repository;

import com.Ai_Interview_Platform.DSA.entity.Question;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.Optional;

public interface QuestionRepository extends
        JpaRepository<Question, Long>,
        JpaSpecificationExecutor<Question> {

    boolean existsByTitle(String title);

    boolean existsBySlug(String slug);

    Optional<Question> findByTitle(String title);

    @EntityGraph(attributePaths = {
            "companies",
            "patterns",
            "languageTemplates",
            "testCases"
    })
    Optional<Question> findDetailsBySlug(String slug);

}
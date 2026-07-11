package com.Ai_Interview_Platform.DSA.repository;

import com.Ai_Interview_Platform.DSA.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface QuestionRepository extends JpaRepository<Question, Long> {

    boolean existsByTitle(String title);

    boolean existsBySlug(String slug);

    Optional<Question> findByTitle(String title);

    Optional<Question> findBySlug(String slug);

}
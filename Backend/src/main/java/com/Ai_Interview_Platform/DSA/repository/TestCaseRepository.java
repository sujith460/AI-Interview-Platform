package com.Ai_Interview_Platform.DSA.repository;

import com.Ai_Interview_Platform.DSA.entity.TestCase;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TestCaseRepository extends JpaRepository<TestCase, Long> {

    List<TestCase> findByQuestionId(Long questionId);

    List<TestCase> findByQuestionIdAndSampleTrueOrderByOrderIndexAsc(Long questionId);

    List<TestCase> findByQuestionIdOrderByOrderIndexAsc(Long questionId);

    boolean existsByQuestionIdAndOrderIndexAndIdNot(Long id, Integer orderIndex, Long id1);

    boolean existsByQuestionIdAndOrderIndex(@NotNull(message = "Question Id is required") Long questionId, @NotNull(message = "Order index is required") Integer orderIndex);
}
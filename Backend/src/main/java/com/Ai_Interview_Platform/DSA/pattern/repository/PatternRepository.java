package com.Ai_Interview_Platform.DSA.pattern.repository;

import com.Ai_Interview_Platform.DSA.pattern.entity.Pattern;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PatternRepository extends JpaRepository<Pattern, Long> {

    boolean existsByName(String name);

    Optional<Pattern> findByName(String name);

}

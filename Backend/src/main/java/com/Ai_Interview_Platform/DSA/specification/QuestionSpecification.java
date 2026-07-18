package com.Ai_Interview_Platform.DSA.specification;

import com.Ai_Interview_Platform.DSA.dto.question.QuestionSearchRequestDTO;
import com.Ai_Interview_Platform.DSA.entity.Company;
import com.Ai_Interview_Platform.DSA.entity.Pattern;
import com.Ai_Interview_Platform.DSA.entity.Question;
import org.springframework.data.jpa.domain.Specification;

import jakarta.persistence.criteria.Join;

public class QuestionSpecification {

    public static Specification<Question> buildSpecification(
            QuestionSearchRequestDTO request) {

        return (root, query, cb) -> {

            query.distinct(true);

            var predicate = cb.conjunction();

            // Search by title
            if (request.getSearch() != null &&
                    !request.getSearch().trim().isEmpty()) {

                predicate = cb.and(
                        predicate,
                        cb.like(
                                cb.lower(root.get("title")),
                                "%" + request.getSearch().toLowerCase().trim() + "%"
                        )
                );
            }

            // Difficulty
            if (request.getDifficulty() != null) {

                predicate = cb.and(
                        predicate,
                        cb.equal(
                                root.get("difficulty"),
                                request.getDifficulty()
                        )
                );

            }

            // Companies
            if (request.getCompanyIds() != null &&
                    !request.getCompanyIds().isEmpty()) {

                Join<Question, Company> companyJoin =
                        root.join("companies");

                predicate = cb.and(
                        predicate,
                        companyJoin.get("id").in(request.getCompanyIds())
                );

            }

            // Patterns
            if (request.getPatternIds() != null &&
                    !request.getPatternIds().isEmpty()) {

                Join<Question, Pattern> patternJoin =
                        root.join("patterns");

                predicate = cb.and(
                        predicate,
                        patternJoin.get("id").in(request.getPatternIds())
                );

            }

            return predicate;

        };

    }

}
package com.Ai_Interview_Platform.DSA.question.dto;

import com.Ai_Interview_Platform.DSA.question.enums.Difficulty;
import com.Ai_Interview_Platform.DSA.question.enums.QuestionSortBy;
import com.Ai_Interview_Platform.DSA.question.enums.SortDirection;
import lombok.Data;

import java.util.Set;

@Data
public class QuestionSearchRequestDTO {

    private String search;

    private Difficulty difficulty;

    private Set<Long> companyIds;

    private Set<Long> patternIds;

    private int page = 0;

    private int size = 10;

    private QuestionSortBy sortBy = QuestionSortBy.CREATED_AT;

    private SortDirection sortDirection = SortDirection.DESC;

}

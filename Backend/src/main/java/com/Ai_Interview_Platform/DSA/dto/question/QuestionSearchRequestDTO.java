package com.Ai_Interview_Platform.DSA.dto.question;

import com.Ai_Interview_Platform.DSA.entity.enums.Difficulty;
import com.Ai_Interview_Platform.DSA.entity.enums.QuestionSortBy;
import com.Ai_Interview_Platform.DSA.entity.enums.SortDirection;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuestionSearchRequestDTO {

    private int page = 0;

    private int size = 20;

    private String search;

    private Difficulty difficulty;

    private List<Long> companyIds;

    private List<Long> patternIds;

    private QuestionSortBy sortBy = QuestionSortBy.CREATED_AT;

    private SortDirection sortDirection = SortDirection.DESC;

}
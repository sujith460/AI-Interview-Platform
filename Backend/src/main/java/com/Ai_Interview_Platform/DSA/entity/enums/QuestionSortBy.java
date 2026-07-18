package com.Ai_Interview_Platform.DSA.entity.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum QuestionSortBy {

    TITLE("title"),
    DIFFICULTY("difficulty"),
    CREATED_AT("createdAt");

    private final String field;

}
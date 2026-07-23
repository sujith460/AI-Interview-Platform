package com.Ai_Interview_Platform.DSA.question.mapper;

import com.Ai_Interview_Platform.DSA.company.entity.Company;
import com.Ai_Interview_Platform.DSA.languagetemplate.mapper.LanguageTemplateMapper;
import com.Ai_Interview_Platform.DSA.pattern.entity.Pattern;
import com.Ai_Interview_Platform.DSA.question.dto.QuestionDetailsResponseDTO;
import com.Ai_Interview_Platform.DSA.question.entity.Question;
import com.Ai_Interview_Platform.DSA.testcase.mapper.TestCaseMapper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.Set;
import java.util.stream.Collectors;

@Mapper(
        componentModel = "spring",
        uses = {
                LanguageTemplateMapper.class,
                TestCaseMapper.class
        }
)
public interface QuestionDetailsMapper {

    @Mapping(target = "companies",
            expression = "java(mapCompanies(question.getCompanies()))")

    @Mapping(target = "patterns",
            expression = "java(mapPatterns(question.getPatterns()))")

    @Mapping(target = "sampleTestCases",
            source = "testCases")

    QuestionDetailsResponseDTO toResponse(Question question);


    default Set<String> mapCompanies(Set<Company> companies) {

        return companies.stream()
                .map(Company::getName)
                .collect(Collectors.toSet());

    }

    default Set<String> mapPatterns(Set<Pattern> patterns) {

        return patterns.stream()
                .map(Pattern::getName)
                .collect(Collectors.toSet());

    }

}

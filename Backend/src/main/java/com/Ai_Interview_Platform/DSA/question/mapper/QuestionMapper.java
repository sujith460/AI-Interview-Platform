package com.Ai_Interview_Platform.DSA.question.mapper;

import com.Ai_Interview_Platform.DSA.company.entity.Company;
import com.Ai_Interview_Platform.DSA.pattern.entity.Pattern;
import com.Ai_Interview_Platform.DSA.question.dto.QuestionRequestDTO;
import com.Ai_Interview_Platform.DSA.question.dto.QuestionResponseDTO;
import com.Ai_Interview_Platform.DSA.question.dto.QuestionUpdateDTO;
import com.Ai_Interview_Platform.DSA.question.entity.Question;
import org.mapstruct.*;

import java.util.Set;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface QuestionMapper {

        @Mapping(target = "companies", ignore = true)
        @Mapping(target = "patterns", ignore = true)
        @Mapping(target = "id", ignore = true)
        @Mapping(target = "slug", ignore = true)
        @Mapping(target = "createdAt", ignore = true)
        @Mapping(target = "updatedAt", ignore = true)
        Question toEntity(QuestionRequestDTO dto);

        @BeanMapping(
                nullValuePropertyMappingStrategy =
                        NullValuePropertyMappingStrategy.IGNORE
        )
        @Mapping(target = "companies", ignore = true)
        @Mapping(target = "patterns", ignore = true)
        @Mapping(target = "id", ignore = true)
        @Mapping(target = "slug", ignore = true)
        @Mapping(target = "createdAt", ignore = true)
        @Mapping(target = "updatedAt", ignore = true)
        void updateQuestionFromDto(
                QuestionUpdateDTO dto,
                @MappingTarget Question question);

        @Mapping(target = "companies", expression = "java(mapCompanies(question.getCompanies()))")
        @Mapping(target = "patterns", expression = "java(mapPatterns(question.getPatterns()))")
        QuestionResponseDTO toResponse(Question question);

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


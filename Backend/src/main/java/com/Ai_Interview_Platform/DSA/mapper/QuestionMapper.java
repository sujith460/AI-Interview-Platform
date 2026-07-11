package com.Ai_Interview_Platform.DSA.mapper;

import com.Ai_Interview_Platform.DSA.dto.question.QuestionRequestDTO;
import com.Ai_Interview_Platform.DSA.dto.question.QuestionResponseDTO;
import com.Ai_Interview_Platform.DSA.entity.Question;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface QuestionMapper {

    @Mapping(target = "companies", ignore = true)
    @Mapping(target = "patterns", ignore = true)d
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
            QuestionRequestDTO dto,
            @MappingTarget Question question
    );

}
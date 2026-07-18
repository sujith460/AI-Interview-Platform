package com.Ai_Interview_Platform.DSA.mapper;

import com.Ai_Interview_Platform.DSA.dto.languagetemplate.LanguageTemplateRequestDTO;
import com.Ai_Interview_Platform.DSA.dto.languagetemplate.LanguageTemplateResponseDTO;
import com.Ai_Interview_Platform.DSA.dto.languagetemplate.LanguageTemplateUpdateDTO;
import com.Ai_Interview_Platform.DSA.entity.LanguageTemplate;
import com.Ai_Interview_Platform.DSA.entity.Question;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface LanguageTemplateMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "question", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    LanguageTemplate toEntity(LanguageTemplateRequestDTO dto);

    @Mapping(target = "questionId", source = "question")
    LanguageTemplateResponseDTO toResponse(LanguageTemplate languageTemplate);

    @BeanMapping(
            nullValuePropertyMappingStrategy =
                    NullValuePropertyMappingStrategy.IGNORE
    )
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "question", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateLanguageTemplateFromDto(
            LanguageTemplateUpdateDTO dto,
            @MappingTarget LanguageTemplate languageTemplate
    );

    default Long map(Question question) {

        return question == null ? null : question.getId();

    }

}
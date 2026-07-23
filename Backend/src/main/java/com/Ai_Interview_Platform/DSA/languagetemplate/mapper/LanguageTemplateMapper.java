package com.Ai_Interview_Platform.DSA.languagetemplate.mapper;

import com.Ai_Interview_Platform.DSA.languagetemplate.dto.LanguageTemplateRequestDTO;
import com.Ai_Interview_Platform.DSA.languagetemplate.dto.LanguageTemplateResponseDTO;
import com.Ai_Interview_Platform.DSA.languagetemplate.dto.LanguageTemplateUpdateDTO;
import com.Ai_Interview_Platform.DSA.languagetemplate.entity.LanguageTemplate;
import com.Ai_Interview_Platform.DSA.question.entity.Question;
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

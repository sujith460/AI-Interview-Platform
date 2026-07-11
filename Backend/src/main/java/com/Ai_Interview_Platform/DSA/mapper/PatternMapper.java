package com.Ai_Interview_Platform.DSA.mapper;

import com.Ai_Interview_Platform.DSA.dto.pattern.PatternRequestDTO;
import com.Ai_Interview_Platform.DSA.dto.pattern.PatternResponseDTO;
import com.Ai_Interview_Platform.DSA.entity.Pattern;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface PatternMapper {

    Pattern toEntity(PatternRequestDTO dto);

    PatternResponseDTO toResponse(Pattern pattern);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updatePatternFromDto(
            PatternRequestDTO dto,
            @MappingTarget Pattern pattern);

}
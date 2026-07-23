package com.Ai_Interview_Platform.DSA.pattern.mapper;

import com.Ai_Interview_Platform.DSA.pattern.dto.PatternRequestDTO;
import com.Ai_Interview_Platform.DSA.pattern.dto.PatternResponseDTO;
import com.Ai_Interview_Platform.DSA.pattern.entity.Pattern;
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

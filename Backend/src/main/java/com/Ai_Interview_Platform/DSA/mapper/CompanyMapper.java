package com.Ai_Interview_Platform.DSA.mapper;

import com.Ai_Interview_Platform.DSA.dto.company.CompanyRequestDTO;
import com.Ai_Interview_Platform.DSA.dto.company.CompanyResponseDTO;
import com.Ai_Interview_Platform.DSA.entity.Company;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring")
public interface CompanyMapper {

    Company toEntity(CompanyRequestDTO dto);

    CompanyResponseDTO toResponse(Company company);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateCompanyFromDto(CompanyRequestDTO dto,
                              @MappingTarget Company company);
}
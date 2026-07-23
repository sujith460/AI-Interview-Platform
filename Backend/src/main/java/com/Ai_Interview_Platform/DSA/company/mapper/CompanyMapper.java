package com.Ai_Interview_Platform.DSA.company.mapper;

import com.Ai_Interview_Platform.DSA.company.dto.CompanyRequestDTO;
import com.Ai_Interview_Platform.DSA.company.dto.CompanyResponseDTO;
import com.Ai_Interview_Platform.DSA.company.entity.Company;
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

package com.Ai_Interview_Platform.DSA.company.service;

import com.Ai_Interview_Platform.DSA.company.dto.CompanyRequestDTO;
import com.Ai_Interview_Platform.DSA.company.dto.CompanyResponseDTO;
import com.Ai_Interview_Platform.DSA.company.entity.Company;
import com.Ai_Interview_Platform.DSA.company.mapper.CompanyMapper;
import com.Ai_Interview_Platform.DSA.company.repository.CompanyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CompanyService {

    private final CompanyRepository companyRepository;

    private final CompanyMapper companyMapper;

    public CompanyResponseDTO createCompany(CompanyRequestDTO request) {

        if (companyRepository.existsByName(request.getName())) {

            throw new RuntimeException("Company already exists");

        }

        Company company = companyMapper.toEntity(request);

        Company savedCompany = companyRepository.save(company);

        return companyMapper.toResponse(savedCompany);

    }

    public List<CompanyResponseDTO> getAllCompanies() {

        List<Company> companies = companyRepository.findAll();

        return companies.stream()
                .map(companyMapper::toResponse)
                .toList();

    }

    public CompanyResponseDTO getCompanyById(Long id) {

        Company company = companyRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Company not found"));

        return companyMapper.toResponse(company);

    }

    public CompanyResponseDTO updateCompany(Long id, CompanyRequestDTO request) {

        Company company = companyRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Company not found"));

        // Check if another company already uses this name
        companyRepository.findByName(request.getName())
                .ifPresent(existingCompany -> {
                    if (!existingCompany.getId().equals(id)) {
                        throw new RuntimeException("Company name already exists");
                    }
                });

        companyMapper.updateCompanyFromDto(request, company);

        Company updatedCompany = companyRepository.save(company);

        return companyMapper.toResponse(updatedCompany);
    }
    public void deleteCompany(Long id) {

        Company company = companyRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Company not found"));

        companyRepository.delete(company);
    }

}

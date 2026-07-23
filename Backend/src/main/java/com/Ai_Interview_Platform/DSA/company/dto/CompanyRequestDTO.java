package com.Ai_Interview_Platform.DSA.company.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CompanyRequestDTO {

    @NotBlank(message = "Company name is required")
    private String name;

    private String logoUrl;

    private String website;

    private String careerPage;

    private String description;
}

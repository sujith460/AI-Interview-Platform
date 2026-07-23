package com.Ai_Interview_Platform.DSA.company.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CompanyResponseDTO {

    private Long id;

    private String name;

    private String logoUrl;

    private String website;

    private String careerPage;

    private String description;
}

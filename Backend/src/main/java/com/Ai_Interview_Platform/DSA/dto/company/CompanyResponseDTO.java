package com.Ai_Interview_Platform.DSA.dto.company;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CompanyResponseDTO {

    private Long id;

    private String name;

    private String logoUrl;

    private String website;

    private String careerPage;

    private String description;
}
package com.Ai_Interview_Platform.DSA.dto.profile;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProfileUpdateRequestDTO {

    @Size(max = 500)
    private String bio;

    private String githubUrl;

    private String leetcodeUrl;

    private String linkedinUrl;

    private String resumeUrl;

    private Integer experience;

    private String targetRole;

    @Size(max = 1000)
    private String skills;
}
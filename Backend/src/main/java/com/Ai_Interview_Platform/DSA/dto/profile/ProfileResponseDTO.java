package com.Ai_Interview_Platform.DSA.dto.profile;

import com.Ai_Interview_Platform.DSA.entity.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProfileResponseDTO {

    private Long id;

    private String fullName;

    private String email;

    private Role role;

    private String bio;

    private String githubUrl;

    private String leetcodeUrl;

    private String linkedinUrl;

    private String resumeUrl;

    private Integer experience;

    private String targetRole;

    private String skills;
}
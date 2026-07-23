package com.Ai_Interview_Platform.DSA.user.dto;

import lombok.Data;

@Data
public class ProfileUpdateRequestDTO {

    private String bio;

    private String githubUrl;

    private String leetcodeUrl;

    private String linkedinUrl;

    private String resumeUrl;

    private Integer experience;

    private String targetRole;

    private String skills;

}

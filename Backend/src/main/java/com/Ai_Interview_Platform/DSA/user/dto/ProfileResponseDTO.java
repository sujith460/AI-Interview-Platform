package com.Ai_Interview_Platform.DSA.user.dto;

import lombok.*;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProfileResponseDTO {

    private Long id;

    private String fullName;

    private String email;

    private String bio;

    private String githubUrl;

    private String leetcodeUrl;

    private String linkedinUrl;

    private String resumeUrl;

    private Integer experience;

    private String targetRole;

    private String skills;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

}

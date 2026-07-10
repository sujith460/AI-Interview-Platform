package com.Ai_Interview_Platform.DSA.entity;


import com.Ai_Interview_Platform.DSA.entity.enums.Role;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String fullName;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    private String bio;

    private String githubUrl;

    private String leetcodeUrl;

    private String linkedinUrl;

    private String resumeUrl;

    private Integer experience;

    private String targetRole;

    @Column(length = 1000)
    private String skills;




    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;
}

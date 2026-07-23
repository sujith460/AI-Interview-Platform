package com.Ai_Interview_Platform.DSA.question.entity;

import com.Ai_Interview_Platform.DSA.common.enums.Difficulty;
import com.Ai_Interview_Platform.DSA.company.entity.Company;
import com.Ai_Interview_Platform.DSA.languagetemplate.entity.LanguageTemplate;
import com.Ai_Interview_Platform.DSA.pattern.entity.Pattern;
import com.Ai_Interview_Platform.DSA.testcase.entity.TestCase;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "questions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 300)
    private String title;

    @Column(nullable = false, unique = true, length = 350)
    private String slug;

    @Column(columnDefinition = "TEXT" , nullable = false)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Difficulty difficulty;

    @Column(columnDefinition = "TEXT")
    private String constraints;

    @Column(columnDefinition = "TEXT")
    private String examples;

    @Column(length = 1000)
    private String functionSignature;

    private Integer estimatedTimeMinutes;

    @Column(nullable = false)
    private Boolean interviewQuestion = true;

    @Column(nullable = false)
    private Boolean premium = false;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "question_companies",
            joinColumns = @JoinColumn(name = "question_id"),
            inverseJoinColumns = @JoinColumn(name = "company_id")
    )
    private Set<Company> companies = new HashSet<>();

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "question_patterns",
            joinColumns = @JoinColumn(name = "question_id"),
            inverseJoinColumns = @JoinColumn(name = "pattern_id")
    )
    private Set<Pattern> patterns = new HashSet<>();

    @OneToMany(
            mappedBy = "question",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private Set<TestCase> testCases = new HashSet<>();

    @OneToMany(
            mappedBy = "question",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private Set<LanguageTemplate> languageTemplates = new HashSet<>();

    private Integer frequencyScore;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    public void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

}

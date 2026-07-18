package com.Ai_Interview_Platform.DSA.entity;

import com.Ai_Interview_Platform.DSA.entity.enums.ProgrammingLanguage;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "language_templates",
        uniqueConstraints = {
                @UniqueConstraint(
                        columnNames = {
                                "question_id",
                                "language"
                        }
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LanguageTemplate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProgrammingLanguage language;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String starterCode;

    @Column(columnDefinition = "TEXT")
    private String driverCode;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "question_id",
            nullable = false
    )
    private Question question;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
    }

}
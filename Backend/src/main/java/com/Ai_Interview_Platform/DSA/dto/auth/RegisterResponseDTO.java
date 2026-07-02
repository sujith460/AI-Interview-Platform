package com.Ai_Interview_Platform.DSA.dto.auth;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegisterResponseDTO {

    private Long id;

    private String fullName;

    private String email;

    private String message;
}
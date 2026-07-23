package com.Ai_Interview_Platform.DSA.user.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileResponseDTO {

    private Long id;

    private String fullName;

    private String email;

    private String role;

    private LocalDateTime createdAt;

}

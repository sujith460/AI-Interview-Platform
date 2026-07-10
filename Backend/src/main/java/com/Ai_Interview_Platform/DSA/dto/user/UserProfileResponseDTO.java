package com.Ai_Interview_Platform.DSA.dto.user;

import com.Ai_Interview_Platform.DSA.entity.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserProfileResponseDTO {

    private Long id;

    private String fullName;

    private String email;

    private Role role;
}
package com.Ai_Interview_Platform.DSA.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class SendOtpRequestDTO {

    @Email(message = "Valid email is required")
    @NotBlank(message = "Email is required")
    private String email;
}

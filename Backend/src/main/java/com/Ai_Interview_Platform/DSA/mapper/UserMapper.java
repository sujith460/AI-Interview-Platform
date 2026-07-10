package com.Ai_Interview_Platform.DSA.mapper;

import com.Ai_Interview_Platform.DSA.dto.auth.RegisterRequestDTO;
import com.Ai_Interview_Platform.DSA.dto.auth.RegisterResponseDTO;
import com.Ai_Interview_Platform.DSA.dto.profile.ProfileResponseDTO;
import com.Ai_Interview_Platform.DSA.dto.profile.ProfileUpdateRequestDTO;
import com.Ai_Interview_Platform.DSA.dto.user.UserProfileResponseDTO;
import com.Ai_Interview_Platform.DSA.entity.User;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring")
public interface UserMapper {

    // Authentication

    User toEntity(RegisterRequestDTO request);

    RegisterResponseDTO toResponse(User user);

    UserProfileResponseDTO toUserProfileResponse(User user);

    // Profile

    ProfileResponseDTO toProfileResponse(User user);

    @BeanMapping(
            nullValuePropertyMappingStrategy =
                    NullValuePropertyMappingStrategy.IGNORE
    )
    void updateProfileFromDto(
            ProfileUpdateRequestDTO dto,
            @MappingTarget User user
    );

}
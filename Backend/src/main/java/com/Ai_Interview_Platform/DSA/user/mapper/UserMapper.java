package com.Ai_Interview_Platform.DSA.user.mapper;

import com.Ai_Interview_Platform.DSA.auth.dto.RegisterRequestDTO;
import com.Ai_Interview_Platform.DSA.auth.dto.RegisterResponseDTO;
import com.Ai_Interview_Platform.DSA.user.dto.ProfileResponseDTO;
import com.Ai_Interview_Platform.DSA.user.dto.ProfileUpdateRequestDTO;
import com.Ai_Interview_Platform.DSA.user.dto.UserProfileResponseDTO;
import com.Ai_Interview_Platform.DSA.user.entity.User;
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

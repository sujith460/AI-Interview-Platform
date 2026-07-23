package com.Ai_Interview_Platform.DSA.interview.session.mapper;

import com.Ai_Interview_Platform.DSA.interview.session.dto.InterviewSessionResponseDTO;
import com.Ai_Interview_Platform.DSA.interview.session.entity.InterviewSession;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface InterviewSessionMapper {

    @Mapping(source = "id", target = "sessionId")
    @Mapping(source = "company.id", target = "companyId")
    @Mapping(source = "company.name", target = "companyName")
    InterviewSessionResponseDTO toResponseDTO(InterviewSession interviewSession);

}
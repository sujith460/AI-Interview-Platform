package com.Ai_Interview_Platform.DSA.interview.session.service;

import com.Ai_Interview_Platform.DSA.company.entity.Company;
import com.Ai_Interview_Platform.DSA.company.repository.CompanyRepository;
import com.Ai_Interview_Platform.DSA.interview.session.dto.InterviewSessionResponseDTO;
import com.Ai_Interview_Platform.DSA.interview.session.dto.StartInterviewRequestDTO;
import com.Ai_Interview_Platform.DSA.interview.session.entity.InterviewSession;
import com.Ai_Interview_Platform.DSA.interview.session.enums.InterviewState;
import com.Ai_Interview_Platform.DSA.interview.session.mapper.InterviewSessionMapper;
import com.Ai_Interview_Platform.DSA.interview.session.repository.InterviewSessionRepository;
import com.Ai_Interview_Platform.DSA.user.entity.User;
import com.Ai_Interview_Platform.DSA.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class InterviewSessionService {

    private final InterviewSessionRepository interviewSessionRepository;
    private final CompanyRepository companyRepository;
    private final UserRepository userRepository;
    private final InterviewSessionMapper interviewSessionMapper;

    public InterviewSessionResponseDTO startInterview(StartInterviewRequestDTO requestDTO) {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        User candidate = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Authenticated user not found"));

        Company company = companyRepository.findById(requestDTO.getCompanyId())
                .orElseThrow(() -> new RuntimeException("Company not found"));

        InterviewSession interviewSession = InterviewSession.builder()
                .candidate(candidate)
                .company(company)
                .interviewType(requestDTO.getInterviewType())
                .difficulty(requestDTO.getDifficulty())
                .state(InterviewState.CREATED)
                .build();

        InterviewSession savedInterview =
                interviewSessionRepository.save(interviewSession);

        return interviewSessionMapper.toResponseDTO(savedInterview);
    }

}
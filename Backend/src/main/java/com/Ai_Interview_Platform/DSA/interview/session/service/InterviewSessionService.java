package com.Ai_Interview_Platform.DSA.interview.session.service;

import com.Ai_Interview_Platform.DSA.ai.model.AIResponse;
import com.Ai_Interview_Platform.DSA.company.entity.Company;
import com.Ai_Interview_Platform.DSA.company.repository.CompanyRepository;
import com.Ai_Interview_Platform.DSA.conversation.dto.CandidateMessageRequestDTO;
import com.Ai_Interview_Platform.DSA.conversation.service.ConversationService;
import com.Ai_Interview_Platform.DSA.interview.session.dto.InterviewCodeSubmissionDTO;
import com.Ai_Interview_Platform.DSA.interview.session.dto.InterviewSessionResponseDTO;
import com.Ai_Interview_Platform.DSA.interview.session.dto.StartInterviewRequestDTO;
import com.Ai_Interview_Platform.DSA.interview.session.entity.InterviewSession;
import com.Ai_Interview_Platform.DSA.interview.session.enums.InterviewState;
import com.Ai_Interview_Platform.DSA.interview.session.mapper.InterviewSessionMapper;
import com.Ai_Interview_Platform.DSA.interview.session.orchestrator.InterviewOrchestrator;
import com.Ai_Interview_Platform.DSA.interview.session.repository.InterviewSessionRepository;
import com.Ai_Interview_Platform.DSA.user.entity.User;
import com.Ai_Interview_Platform.DSA.user.repository.UserRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class InterviewSessionService {

    private final InterviewSessionRepository interviewSessionRepository;
    private final CompanyRepository companyRepository;
    private final UserRepository userRepository;
    private final InterviewSessionMapper interviewSessionMapper;
    private final ConversationService conversationService;
    private final InterviewOrchestrator interviewOrchestrator;

    public InterviewSessionResponseDTO createInterviewSession(StartInterviewRequestDTO requestDTO) {
        User candidate = getAuthenticatedUser();

        Company company = companyRepository.findById(requestDTO.getCompanyId())
                .orElseThrow(() -> new EntityNotFoundException("Company not found with id: " + requestDTO.getCompanyId()));

        InterviewSession interviewSession = InterviewSession.builder()
                .candidate(candidate)
                .company(company)
                .interviewType(requestDTO.getInterviewType())
                .difficulty(requestDTO.getDifficulty())
                .state(InterviewState.CREATED)
                .build();

        InterviewSession savedInterview = interviewSessionRepository.save(interviewSession);
        conversationService.createConversation(savedInterview.getId());

        return interviewSessionMapper.toResponseDTO(savedInterview);
    }

    public AIResponse startInterview(UUID sessionId) throws JsonProcessingException {
        InterviewSession session = getSessionAndValidateCandidate(sessionId);
        return interviewOrchestrator.startInterview(session);
    }

    public AIResponse submitCandidateMessage(UUID sessionId, CandidateMessageRequestDTO requestDTO) throws JsonProcessingException {
        InterviewSession session = getSessionAndValidateCandidate(sessionId);
        return interviewOrchestrator.submitCandidateMessage(session, requestDTO);
    }

    public AIResponse requestHint(UUID sessionId) throws JsonProcessingException {
        InterviewSession session = getSessionAndValidateCandidate(sessionId);
        return interviewOrchestrator.requestHint(session);
    }

    public AIResponse submitCode(UUID sessionId, InterviewCodeSubmissionDTO requestDTO) throws JsonProcessingException {
        InterviewSession session = getSessionAndValidateCandidate(sessionId);
        return interviewOrchestrator.submitCode(session, requestDTO);
    }

    public AIResponse finishInterview(UUID sessionId) throws JsonProcessingException {
        InterviewSession session = getSessionAndValidateCandidate(sessionId);
        return interviewOrchestrator.finishInterview(session);
    }

    @Transactional(readOnly = true)
    public InterviewSessionResponseDTO getInterviewSession(UUID sessionId) {
        InterviewSession session = getSessionAndValidateCandidate(sessionId);
        return interviewSessionMapper.toResponseDTO(session);
    }

    private User getAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new IllegalStateException("No authenticated user found in security context");
        }
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("Authenticated user not found with email: " + email));
    }

    private InterviewSession getSessionAndValidateCandidate(UUID sessionId) {
        InterviewSession session = interviewSessionRepository.findById(sessionId)
                .orElseThrow(() -> new EntityNotFoundException("Interview Session not found with id: " + sessionId));

        User candidate = getAuthenticatedUser();
        if (!session.getCandidate().getId().equals(candidate.getId())) {
            throw new IllegalStateException("User is not authorized to access this interview session.");
        }
        return session;
    }
}
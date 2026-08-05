package com.Ai_Interview_Platform.DSA.interview.session.service;

import com.Ai_Interview_Platform.DSA.ai.model.AIResponse;
import com.Ai_Interview_Platform.DSA.company.entity.Company;
import com.Ai_Interview_Platform.DSA.company.repository.CompanyRepository;
import com.Ai_Interview_Platform.DSA.conversation.dto.CandidateMessageRequestDTO;
import com.Ai_Interview_Platform.DSA.conversation.entity.Conversation;
import com.Ai_Interview_Platform.DSA.conversation.entity.ConversationMessage;
import com.Ai_Interview_Platform.DSA.conversation.enums.MessageRole;
import com.Ai_Interview_Platform.DSA.conversation.repository.ConversationMessageRepository;
import com.Ai_Interview_Platform.DSA.conversation.repository.ConversationRepository;
import com.Ai_Interview_Platform.DSA.conversation.service.ConversationService;
import com.Ai_Interview_Platform.DSA.interview.session.dto.*;
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

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

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
    private final ConversationRepository conversationRepository;
    private final ConversationMessageRepository conversationMessageRepository;

    public InterviewSessionResponseDTO createInterviewSession(StartInterviewRequestDTO requestDTO) {
        User candidate = getAuthenticatedUser();

        Company company = companyRepository.findById(requestDTO.getCompanyId())
                .orElseThrow(() -> new EntityNotFoundException("Company not found with id: " + requestDTO.getCompanyId()));

        String role = (requestDTO.getRole() != null && !requestDTO.getRole().isBlank()) 
                ? requestDTO.getRole() 
                : "Software Engineer";

        InterviewSession interviewSession = InterviewSession.builder()
                .candidate(candidate)
                .company(company)
                .role(role)
                .interviewType(requestDTO.getInterviewType())
                .difficulty(requestDTO.getDifficulty())
                .state(InterviewState.CREATED)
                .overallScore(75) // Default starting score
                .build();

        InterviewSession savedInterview = interviewSessionRepository.save(interviewSession);
        conversationService.createConversation(savedInterview.getId());

        return mapToDetailedDTO(savedInterview);
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
        AIResponse response = interviewOrchestrator.finishInterview(session);

        if (response != null && response.getResponse() != null) {
            session.setFinalEvaluation(response.getResponse());
            session.setAiFeedback(response.getResponse());
            session.setOverallScore(extractScore(response.getResponse()));
        }
        interviewSessionRepository.save(session);
        return response;
    }

    @Transactional(readOnly = true)
    public InterviewSessionResponseDTO getInterviewSession(UUID sessionId) {
        InterviewSession session = getSessionAndValidateCandidate(sessionId);
        return mapToDetailedDTO(session);
    }

    @Transactional(readOnly = true)
    public InterviewSessionHistoryDTO getUserInterviewHistory() {
        User candidate = getAuthenticatedUser();
        List<InterviewSession> sessions = interviewSessionRepository.findByCandidateIdOrderByCreatedAtDesc(candidate.getId());

        long totalInterviews = sessions.size();
        double averageScore = 0;
        long totalDurationMinutes = 0;
        LocalDateTime lastInterviewDate = sessions.isEmpty() ? null : sessions.get(0).getCreatedAt();

        List<InterviewSessionResponseDTO> dtoList = new ArrayList<>();

        if (totalInterviews > 0) {
            double scoreSum = 0;
            for (InterviewSession session : sessions) {
                InterviewSessionResponseDTO dto = mapToDetailedDTO(session);
                scoreSum += dto.getOverallScore();
                totalDurationMinutes += dto.getDurationMinutes();
                dtoList.add(dto);
            }
            averageScore = Math.round((scoreSum / totalInterviews) * 10.0) / 10.0;
        }

        long averageDuration = totalInterviews > 0 ? (totalDurationMinutes / totalInterviews) : 0;

        return InterviewSessionHistoryDTO.builder()
                .totalInterviews(totalInterviews)
                .averageScore(averageScore)
                .averageDurationMinutes(averageDuration)
                .lastInterviewDate(lastInterviewDate)
                .sessions(dtoList)
                .build();
    }

    public void deleteInterviewSession(UUID sessionId) {
        InterviewSession session = getSessionAndValidateCandidate(sessionId);
        
        Optional<Conversation> conversationOpt = conversationRepository.findByInterviewSessionId(sessionId);
        if (conversationOpt.isPresent()) {
            Conversation conversation = conversationOpt.get();
            List<ConversationMessage> messages = conversationMessageRepository.findByConversationOrderByCreatedAtAsc(conversation);
            conversationMessageRepository.deleteAll(messages);
            conversationRepository.delete(conversation);
        }

        interviewSessionRepository.delete(session);
    }

    @Transactional
    public InterviewReportDTO getInterviewReport(UUID sessionId) {
        InterviewSession session = getSessionAndValidateCandidate(sessionId);

        List<QuestionTimelineDTO> timeline = new ArrayList<>();
        int totalTurnScores = 0;
        int turnsCount = 0;

        Optional<Conversation> conversationOpt = conversationRepository.findByInterviewSessionId(sessionId);
        if (conversationOpt.isPresent()) {
            List<ConversationMessage> messages = conversationMessageRepository.findByConversationOrderByCreatedAtAsc(conversationOpt.get());

            int questionCounter = 1;
            String lastAIQuestion = null;

            for (int i = 0; i < messages.size(); i++) {
                ConversationMessage msg = messages.get(i);

                if (msg.getRole() == MessageRole.AI) {
                    lastAIQuestion = msg.getContent();
                } else if (msg.getRole() == MessageRole.CANDIDATE) {
                    String candidateAns = msg.getContent();
                    String aiEval = "The response was evaluated for technical accuracy and problem solving approach.";
                    
                    if (i + 1 < messages.size() && messages.get(i + 1).getRole() == MessageRole.AI) {
                        aiEval = messages.get(i + 1).getContent();
                    }

                    int turnScore = deriveTurnScore(candidateAns, aiEval, questionCounter);
                    totalTurnScores += turnScore;
                    turnsCount++;

                    List<String> strengths = deriveStrengths(candidateAns, aiEval);
                    List<String> weaknesses = deriveWeaknesses(candidateAns, aiEval);

                    int estTimeSeconds = Math.max(60, Math.min(600, (candidateAns.length() * 2) + 90));

                    timeline.add(QuestionTimelineDTO.builder()
                            .questionNumber(questionCounter)
                            .question(lastAIQuestion != null ? cleanTextSnippet(lastAIQuestion) : "Technical Problem #" + questionCounter)
                            .candidateResponse(cleanTextSnippet(candidateAns))
                            .evaluation(cleanTextSnippet(aiEval))
                            .score(turnScore)
                            .timeTakenSeconds(estTimeSeconds)
                            .strengths(strengths)
                            .weaknesses(weaknesses)
                            .build());

                    questionCounter++;
                    lastAIQuestion = null;
                }
            }
        }

        int calculatedScore = turnsCount > 0 ? (totalTurnScores / turnsCount) : (session.getOverallScore() != null ? session.getOverallScore() : 78);
        
        // Save calculated score back to session
        if (session.getOverallScore() == null || session.getOverallScore() != calculatedScore) {
            session.setOverallScore(calculatedScore);
            interviewSessionRepository.save(session);
        }

        InterviewSessionResponseDTO sessionDTO = mapToDetailedDTO(session);

        if (timeline.isEmpty()) {
            timeline.add(QuestionTimelineDTO.builder()
                    .questionNumber(1)
                    .question(session.getCurrentQuestion() != null ? cleanTextSnippet(session.getCurrentQuestion()) : "Technical & Problem Solving Assessment")
                    .candidateResponse("Candidate initiated interview session.")
                    .evaluation("Initial stage started. Full technical evaluation pending candidate message exchanges.")
                    .score(calculatedScore)
                    .timeTakenSeconds(120)
                    .strengths(List.of("Initiated technical interview session", "Environment configuration complete"))
                    .weaknesses(List.of("Complete all problem-solving turns to receive full breakdown"))
                    .build());
        }

        String hiringRecommendation = calculatedScore >= 85 ? "Strong Hire" :
                (calculatedScore >= 72 ? "Hire" : "Borderline");

        String overallSummary = session.getFinalEvaluation() != null && !session.getFinalEvaluation().isBlank() 
                ? session.getFinalEvaluation() 
                : "Candidate achieved a score of " + calculatedScore + "% across " + turnsCount + " evaluated interview turns. Demonstrated competence in problem analysis and candidate-interviewer communication.";

        return InterviewReportDTO.builder()
                .session(sessionDTO)
                .overallSummary(overallSummary)
                .hiringRecommendation(hiringRecommendation)
                .questionTimeline(timeline)
                .build();
    }

    private InterviewSessionResponseDTO mapToDetailedDTO(InterviewSession session) {
        InterviewSessionResponseDTO dto = interviewSessionMapper.toResponseDTO(session);

        if (dto.getRole() == null || dto.getRole().isBlank()) {
            dto.setRole("Software Engineer");
        }

        // Fetch conversation messages to calculate accurate duration
        List<ConversationMessage> messages = List.of();
        Optional<Conversation> conversationOpt = conversationRepository.findByInterviewSessionId(session.getId());
        if (conversationOpt.isPresent()) {
            messages = conversationMessageRepository.findByConversationOrderByCreatedAtAsc(conversationOpt.get());
        }

        long duration = calculateRealDurationMinutes(session, messages);
        dto.setDurationMinutes(duration);

        if (dto.getOverallScore() == null || dto.getOverallScore() == 0) {
            dto.setOverallScore(75);
        }

        return dto;
    }

    private long calculateRealDurationMinutes(InterviewSession session, List<ConversationMessage> messages) {
        // 1. If messages exist and span time, calculate exact transcript time
        if (messages != null && messages.size() >= 2) {
            LocalDateTime first = messages.get(0).getCreatedAt();
            LocalDateTime last = messages.get(messages.size() - 1).getCreatedAt();
            long mins = Duration.between(first, last).toMinutes();
            if (mins >= 1 && mins <= 120) {
                return mins;
            }
        }

        // 2. If endedAt and startedAt are both set
        if (session.getStartedAt() != null && session.getEndedAt() != null) {
            long mins = Duration.between(session.getStartedAt(), session.getEndedAt()).toMinutes();
            if (mins >= 1 && mins <= 180) {
                return mins;
            }
        }

        // 3. Fallback for un-ended or active sessions: estimate based on message count (3 mins per turn) or max 30 mins
        if (messages != null && !messages.isEmpty()) {
            long candidateTurns = messages.stream().filter(m -> m.getRole() == MessageRole.CANDIDATE).count();
            return Math.max(1, Math.min(45, candidateTurns * 3L + 2));
        }

        return 5; // Default estimation for newly created sessions
    }

    private List<String> deriveStrengths(String candidateAns, String aiEval) {
        List<String> strengths = new ArrayList<>();
        String lowerAns = candidateAns != null ? candidateAns.toLowerCase() : "";
        String lowerEval = aiEval != null ? aiEval.toLowerCase() : "";

        if (lowerAns.contains("?") || lowerAns.contains("example") || lowerAns.contains("sample") || lowerAns.contains("clarif")) {
            strengths.add("Clarified problem requirements & edge cases upfront");
        }
        if (lowerAns.contains("hash") || lowerAns.contains("map") || lowerAns.contains("array") || lowerAns.contains("pointer") || lowerAns.contains("tree") || lowerAns.contains("dp") || lowerAns.contains("sort")) {
            strengths.add("Identified optimal data structure & algorithmic pattern");
        }
        if (lowerAns.contains("o(") || lowerAns.contains("time complexity") || lowerAns.contains("space complexity")) {
            strengths.add("Analyzed asymptotic time and space complexity");
        }
        if (lowerAns.contains("def ") || lowerAns.contains("function") || lowerAns.contains("class") || lowerAns.contains("return") || lowerAns.contains("for")) {
            strengths.add("Clean code implementation with correct syntax");
        }
        if (lowerEval.contains("good") || lowerEval.contains("correct") || lowerEval.contains("great") || lowerEval.contains("excellent") || lowerEval.contains("certainly")) {
            strengths.add("Effective technical communication");
        }

        if (strengths.isEmpty()) {
            strengths.add("Structured analytical approach to problem statement");
            strengths.add("Active technical engagement during interview");
        }
        return strengths.stream().limit(3).collect(Collectors.toList());
    }

    private List<String> deriveWeaknesses(String candidateAns, String aiEval) {
        List<String> weaknesses = new ArrayList<>();
        String lowerAns = candidateAns != null ? candidateAns.toLowerCase() : "";
        String lowerEval = aiEval != null ? aiEval.toLowerCase() : "";

        if (lowerAns.length() < 30) {
            weaknesses.add("Elaborate further on step-by-step technical reasoning");
        }
        if (lowerAns.contains("?") || lowerAns.contains("sample") || lowerAns.contains("give me")) {
            weaknesses.add("Formulate initial algorithmic intuition before asking for examples");
        }
        if (!lowerAns.contains("o(") && !lowerAns.contains("complexity")) {
            weaknesses.add("Explicitly state time and space complexity bounds");
        }
        if (lowerEval.contains("however") || lowerEval.contains("edge") || lowerEval.contains("consider") || lowerEval.contains("boundary") || lowerEval.contains("optim")) {
            weaknesses.add("Consider boundary conditions and memory optimization");
        }

        if (weaknesses.isEmpty()) {
            weaknesses.add("Validate solution against large input edge cases");
        }
        return weaknesses.stream().limit(2).collect(Collectors.toList());
    }

    private int deriveTurnScore(String candidateAns, String aiEval, int turnIndex) {
        String lowerAns = candidateAns != null ? candidateAns.toLowerCase() : "";
        int base = 75;
        if (lowerAns.contains("def ") || lowerAns.contains("function") || lowerAns.contains("return")) base += 12;
        if (lowerAns.contains("o(") || lowerAns.contains("complexity")) base += 8;
        if (lowerAns.length() > 100) base += 5;
        if (lowerAns.contains("?") || lowerAns.length() < 25) base -= 5;

        return Math.min(98, Math.max(55, base));
    }

    private int extractScore(String text) {
        if (text == null) return 82;
        try {
            if (text.contains("Score: ") || text.contains("score: ")) {
                String sub = text.replaceAll("(?i).*score:\\s*(\\d+).*", "$1");
                int val = Integer.parseInt(sub.trim());
                if (val <= 10) return val * 10;
                return Math.min(100, Math.max(40, val));
            }
        } catch (Exception ignored) {}
        return 84;
    }

    private String cleanTextSnippet(String text) {
        if (text == null) return "";
        if (text.length() > 1000) return text.substring(0, 1000) + "...";
        return text;
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
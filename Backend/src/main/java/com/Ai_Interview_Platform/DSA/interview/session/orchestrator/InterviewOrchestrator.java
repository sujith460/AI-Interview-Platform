package com.Ai_Interview_Platform.DSA.interview.session.orchestrator;

import com.Ai_Interview_Platform.DSA.ai.enums.InterviewStage;
import com.Ai_Interview_Platform.DSA.ai.model.AIRequest;
import com.Ai_Interview_Platform.DSA.ai.model.AIResponse;
import com.Ai_Interview_Platform.DSA.ai.prompt.builder.PromptBuilder;
import com.Ai_Interview_Platform.DSA.ai.prompt.context.PromptContext;
import com.Ai_Interview_Platform.DSA.ai.prompt.model.Prompt;
import com.Ai_Interview_Platform.DSA.ai.service.AIService;
import com.Ai_Interview_Platform.DSA.conversation.dto.CandidateMessageRequestDTO;
import com.Ai_Interview_Platform.DSA.conversation.entity.Conversation;
import com.Ai_Interview_Platform.DSA.conversation.entity.ConversationMessage;
import com.Ai_Interview_Platform.DSA.conversation.enums.MessageRole;
import com.Ai_Interview_Platform.DSA.conversation.repository.ConversationMessageRepository;
import com.Ai_Interview_Platform.DSA.conversation.repository.ConversationRepository;
import com.Ai_Interview_Platform.DSA.interview.session.dto.InterviewCodeSubmissionDTO;
import com.Ai_Interview_Platform.DSA.interview.session.entity.InterviewSession;
import com.Ai_Interview_Platform.DSA.interview.session.enums.InterviewState;
import com.Ai_Interview_Platform.DSA.interview.session.repository.InterviewSessionRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class InterviewOrchestrator {

    private final PromptBuilder promptBuilder;
    private final AIService aiService;
    private final InterviewSessionRepository interviewSessionRepository;
    private final ConversationRepository conversationRepository;
    private final ConversationMessageRepository conversationMessageRepository;

    public AIResponse startInterview(InterviewSession session) throws JsonProcessingException {
        if (session.getState() == InterviewState.COMPLETED || session.getState() == InterviewState.CANCELLED) {
            throw new IllegalStateException("Cannot start an interview that is already finished or cancelled.");
        }

        session.setState(InterviewState.IN_PROGRESS);
        if (session.getStartedAt() == null) {
            session.setStartedAt(LocalDateTime.now());
        }
        if (session.getCurrentStage() == null) {
            session.setCurrentStage(InterviewStage.INTRODUCTION);
        }

        Conversation conversation = getOrCreateConversation(session);

        PromptContext context = buildPromptContext(session, List.of(), null, null);
        Prompt prompt = promptBuilder.buildInterviewPrompt(context);

        AIResponse response = executeAIRequest(prompt, session, context.getInterviewStage(), List.of(), null, null);

        saveMessage(conversation, MessageRole.AI, response.getResponse());
        interviewSessionRepository.save(session);

        return response;
    }

    public AIResponse submitCandidateMessage(InterviewSession session, CandidateMessageRequestDTO request) throws JsonProcessingException {
        validateSessionActive(session);

        Conversation conversation = getConversation(session);

        saveMessage(conversation, MessageRole.CANDIDATE, request.getContent());

        List<ConversationMessage> conversationHistory = conversationMessageRepository.findByConversationOrderByCreatedAtAsc(conversation);

        PromptContext context = buildPromptContext(session, conversationHistory, request.getContent(), null);
        if (session.getCurrentStage() == null) {
            context.setInterviewStage(InterviewStage.QUESTION);
        }

        Prompt prompt = promptBuilder.buildInterviewPrompt(context);
        AIResponse response = executeAIRequest(prompt, session, context.getInterviewStage(), conversationHistory, request.getContent(), null);

        saveMessage(conversation, MessageRole.AI, response.getResponse());
        interviewSessionRepository.save(session);

        return response;
    }

    public AIResponse requestHint(InterviewSession session) throws JsonProcessingException {
        validateSessionActive(session);

        Conversation conversation = getConversation(session);
        List<ConversationMessage> conversationHistory = conversationMessageRepository.findByConversationOrderByCreatedAtAsc(conversation);

        PromptContext context = buildPromptContext(session, conversationHistory, null, null);
        context.setInterviewStage(InterviewStage.HINT);

        Prompt prompt = promptBuilder.buildHintPrompt(context);
        AIResponse response = executeAIRequest(prompt, session, InterviewStage.HINT, conversationHistory, null, null);

        saveMessage(conversation, MessageRole.AI, response.getResponse());
        interviewSessionRepository.save(session);

        return response;
    }

    public AIResponse submitCode(InterviewSession session, InterviewCodeSubmissionDTO request) throws JsonProcessingException {
        validateSessionActive(session);

        if (request.getProgrammingLanguage() != null && !request.getProgrammingLanguage().isBlank()) {
            session.setProgrammingLanguage(request.getProgrammingLanguage());
        }

        Conversation conversation = getConversation(session);
        String candidateCodeMessage = "Candidate submitted code:\n```"
                + (session.getProgrammingLanguage() != null ? session.getProgrammingLanguage() : "")
                + "\n" + request.getCode() + "\n```";

        saveMessage(conversation, MessageRole.CANDIDATE, candidateCodeMessage);

        List<ConversationMessage> conversationHistory = conversationMessageRepository.findByConversationOrderByCreatedAtAsc(conversation);

        PromptContext context = buildPromptContext(session, conversationHistory, null, request.getCode());
        context.setInterviewStage(InterviewStage.EVALUATION);

        Prompt prompt = promptBuilder.buildCodingPrompt(context);
        AIResponse response = executeAIRequest(prompt, session, InterviewStage.EVALUATION, conversationHistory, null, request.getCode());

        saveMessage(conversation, MessageRole.AI, response.getResponse());
        interviewSessionRepository.save(session);

        return response;
    }

    public AIResponse finishInterview(InterviewSession session) throws JsonProcessingException {
        if (session.getState() == InterviewState.COMPLETED) {
            throw new IllegalStateException("Interview session is already completed.");
        }

        session.setState(InterviewState.COMPLETED);
        session.setCurrentStage(InterviewStage.COMPLETED);
        session.setEndedAt(LocalDateTime.now());

        Conversation conversation = getConversation(session);
        List<ConversationMessage> conversationHistory = conversationMessageRepository.findByConversationOrderByCreatedAtAsc(conversation);

        PromptContext context = buildFullPromptContext(session, conversationHistory, null, null);
        context.setInterviewStage(InterviewStage.COMPLETED);

        Prompt prompt = promptBuilder.buildFinalReportPrompt(context);
        AIResponse response = executeAIRequest(prompt, session, InterviewStage.COMPLETED, conversationHistory, null, null);

        saveMessage(conversation, MessageRole.AI, response.getResponse());
        interviewSessionRepository.save(session);

        return response;
    }

    private void validateSessionActive(InterviewSession session) {
        if (session.getState() != InterviewState.IN_PROGRESS) {
            throw new IllegalStateException("Interview session is not in progress. Current state: " + session.getState());
        }
    }

    private Conversation getConversation(InterviewSession session) {
        return conversationRepository.findByInterviewSessionId(session.getId())
                .orElseGet(() -> getOrCreateConversation(session));
    }

    private Conversation getOrCreateConversation(InterviewSession session) {
        return conversationRepository.findByInterviewSessionId(session.getId())
                .orElseGet(() -> {
                    Conversation c = new Conversation();
                    c.setInterviewSession(session);
                    return conversationRepository.save(c);
                });
    }

    private ConversationMessage saveMessage(Conversation conversation, MessageRole role, String content) {
        ConversationMessage message = new ConversationMessage();
        message.setConversation(conversation);
        message.setRole(role);
        message.setContent(content);
        return conversationMessageRepository.save(message);
    }

    /**
     * Sliding context window limit for active interview prompt generation.
     * 6 messages = 3 recent conversation turns (Candidate <-> AI).
     */
    private static final int MAX_RECENT_MESSAGES = 6;

    private List<ConversationMessage> getRecentHistory(List<ConversationMessage> history, int maxMessages) {
        if (history == null || history.isEmpty()) {
            return List.of();
        }
        if (history.size() <= maxMessages) {
            return history;
        }
        return history.subList(history.size() - maxMessages, history.size());
    }

    private PromptContext buildPromptContext(InterviewSession session,
                                             List<ConversationMessage> history,
                                             String candidateAnswer,
                                             String code) {
        // Sliding Window: send only recent context for active interview turns to keep latency & tokens minimal
        List<ConversationMessage> windowedHistory = getRecentHistory(history, MAX_RECENT_MESSAGES);

        return PromptContext.builder()
                .interviewType(session.getInterviewType())
                .interviewStage(session.getCurrentStage())
                .difficulty(session.getDifficulty())
                .company(session.getCompany() != null ? session.getCompany().getName() : null)
                .currentQuestion(session.getCurrentQuestion())
                .programmingLanguage(session.getProgrammingLanguage())
                .candidateAnswer(candidateAnswer)
                .code(code)
                .conversationHistory(windowedHistory)
                .build();
    }

    private PromptContext buildFullPromptContext(InterviewSession session,
                                                 List<ConversationMessage> history,
                                                 String candidateAnswer,
                                                 String code) {
        // Full History Context reserved for Final Report evaluation
        return PromptContext.builder()
                .interviewType(session.getInterviewType())
                .interviewStage(session.getCurrentStage())
                .difficulty(session.getDifficulty())
                .company(session.getCompany() != null ? session.getCompany().getName() : null)
                .currentQuestion(session.getCurrentQuestion())
                .programmingLanguage(session.getProgrammingLanguage())
                .candidateAnswer(candidateAnswer)
                .code(code)
                .conversationHistory(history)
                .build();
    }

    private AIResponse executeAIRequest(Prompt prompt,
                                        InterviewSession session,
                                        InterviewStage stage,
                                        List<ConversationMessage> history,
                                        String candidateAnswer,
                                        String code) throws JsonProcessingException {
        AIRequest aiRequest = AIRequest.builder()
                .systemPrompt(prompt.getSystemPrompt())
                .userPrompt(prompt.getUserPrompt())
                .interviewType(session.getInterviewType())
                .interviewStage(stage)
                .difficulty(session.getDifficulty())
                .company(session.getCompany() != null ? session.getCompany().getName() : null)
                .programmingLanguage(session.getProgrammingLanguage())
                .candidateAnswer(candidateAnswer)
                .code(code)
                .conversationHistory(history)
                .build();

        return aiService.generateResponse(aiRequest);
    }
}
package com.Ai_Interview_Platform.DSA.conversation.service;

import com.Ai_Interview_Platform.DSA.conversation.dto.ConversationHistoryResponseDTO;
import com.Ai_Interview_Platform.DSA.conversation.dto.ConversationMessageRequestDTO;
import com.Ai_Interview_Platform.DSA.conversation.dto.ConversationMessageResponseDTO;
import com.Ai_Interview_Platform.DSA.conversation.dto.ConversationResponseDTO;
import com.Ai_Interview_Platform.DSA.conversation.entity.Conversation;
import com.Ai_Interview_Platform.DSA.conversation.entity.ConversationMessage;
import com.Ai_Interview_Platform.DSA.conversation.mapper.ConversationMapper;
import com.Ai_Interview_Platform.DSA.conversation.repository.ConversationMessageRepository;
import com.Ai_Interview_Platform.DSA.conversation.repository.ConversationRepository;
import com.Ai_Interview_Platform.DSA.interview.session.entity.InterviewSession;
import com.Ai_Interview_Platform.DSA.interview.session.repository.InterviewSessionRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ConversationService {

    private final ConversationRepository conversationRepository;
    private final ConversationMessageRepository conversationMessageRepository;
    private final InterviewSessionRepository interviewSessionRepository;
    private final ConversationMapper conversationMapper;

    public ConversationResponseDTO createConversation(UUID interviewSessionId) {

        InterviewSession interviewSession = interviewSessionRepository
                .findById(interviewSessionId)
                .orElseThrow(() ->
                        new EntityNotFoundException("Interview Session not found."));

        Conversation conversation = new Conversation();
        conversation.setInterviewSession(interviewSession);

        Conversation savedConversation = conversationRepository.save(conversation);

        return conversationMapper.toConversationResponseDTO(savedConversation);
    }

    public ConversationMessageResponseDTO addMessage(
            UUID conversationId,
            ConversationMessageRequestDTO request
    ) {

        Conversation conversation = conversationRepository
                .findById(conversationId)
                .orElseThrow(() ->
                        new EntityNotFoundException("Conversation not found."));

        ConversationMessage message =
                conversationMapper.toConversationMessage(request);

        message.setConversation(conversation);

        ConversationMessage savedMessage =
                conversationMessageRepository.save(message);

        return conversationMapper
                .toConversationMessageResponseDTO(savedMessage);
    }

    public ConversationResponseDTO getConversationByInterviewSession(
            UUID interviewSessionId
    ) {

        InterviewSession interviewSession =
                interviewSessionRepository
                        .findById(interviewSessionId)
                        .orElseThrow(() ->
                                new EntityNotFoundException("Interview Session not found."));

        Conversation conversation =
                conversationRepository
                        .findByInterviewSession(interviewSession)
                        .orElseThrow(() ->
                                new EntityNotFoundException("Conversation not found."));

        return conversationMapper
                .toConversationResponseDTO(conversation);
    }

    public ConversationHistoryResponseDTO getConversationHistory(
            UUID conversationId
    ) {

        Conversation conversation =
                conversationRepository
                        .findById(conversationId)
                        .orElseThrow(() ->
                                new EntityNotFoundException("Conversation not found."));

        List<ConversationMessageResponseDTO> messages =
                conversationMessageRepository
                        .findByConversationOrderByCreatedAtAsc(conversation)
                        .stream()
                        .map(conversationMapper::toConversationMessageResponseDTO)
                        .toList();

        return ConversationHistoryResponseDTO
                .builder()
                .conversationId(conversation.getId())
                .messages(messages)
                .build();
    }

}
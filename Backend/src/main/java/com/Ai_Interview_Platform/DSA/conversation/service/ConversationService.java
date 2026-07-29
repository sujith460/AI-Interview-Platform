package com.Ai_Interview_Platform.DSA.conversation.service;

import com.Ai_Interview_Platform.DSA.conversation.dto.ConversationResponseDTO;
import com.Ai_Interview_Platform.DSA.conversation.entity.Conversation;
import com.Ai_Interview_Platform.DSA.conversation.mapper.ConversationMapper;
import com.Ai_Interview_Platform.DSA.conversation.repository.ConversationRepository;
import com.Ai_Interview_Platform.DSA.interview.session.entity.InterviewSession;
import com.Ai_Interview_Platform.DSA.interview.session.repository.InterviewSessionRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class ConversationService {

    private final ConversationRepository conversationRepository;
    private final InterviewSessionRepository interviewSessionRepository;
    private final ConversationMapper conversationMapper;


    public ConversationResponseDTO createConversation(UUID interviewSessionId) {

        InterviewSession interviewSession = interviewSessionRepository
                .findById(interviewSessionId)
                .orElseThrow(() ->
                        new EntityNotFoundException("Interview Session not found with id: " + interviewSessionId));

        Conversation conversation = new Conversation();
        conversation.setInterviewSession(interviewSession);

        Conversation savedConversation = conversationRepository.save(conversation);

        return conversationMapper.toConversationResponseDTO(savedConversation);
    }

    @Transactional(readOnly = true)
    public ConversationResponseDTO getConversation(UUID conversationId) {

        Conversation conversation = conversationRepository
                .findById(conversationId)
                .orElseThrow(() ->
                        new EntityNotFoundException("Conversation not found with id: " + conversationId));

        return conversationMapper.toConversationResponseDTO(conversation);
    }

    @Transactional(readOnly = true)
    public ConversationResponseDTO getConversationByInterviewSession(
            UUID interviewSessionId
    ) {

        Conversation conversation = conversationRepository
                .findByInterviewSessionId(interviewSessionId)
                .orElseThrow(() ->
                        new EntityNotFoundException("Conversation not found for interview session id: " + interviewSessionId));

        return conversationMapper.toConversationResponseDTO(conversation);
    }

}
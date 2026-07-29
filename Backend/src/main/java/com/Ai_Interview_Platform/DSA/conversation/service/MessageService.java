package com.Ai_Interview_Platform.DSA.conversation.service;

import com.Ai_Interview_Platform.DSA.conversation.dto.ConversationHistoryResponseDTO;
import com.Ai_Interview_Platform.DSA.conversation.dto.ConversationMessageResponseDTO;
import com.Ai_Interview_Platform.DSA.conversation.entity.Conversation;
import com.Ai_Interview_Platform.DSA.conversation.entity.ConversationMessage;
import com.Ai_Interview_Platform.DSA.conversation.enums.MessageRole;
import com.Ai_Interview_Platform.DSA.conversation.mapper.ConversationMapper;
import com.Ai_Interview_Platform.DSA.conversation.repository.ConversationMessageRepository;
import com.Ai_Interview_Platform.DSA.conversation.repository.ConversationRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class MessageService {

    private final ConversationRepository conversationRepository;
    private final ConversationMessageRepository conversationMessageRepository;
    private final ConversationMapper conversationMapper;

    public ConversationMessageResponseDTO addCandidateMessage(UUID conversationId, String content) {
        return addMessage(conversationId, content, MessageRole.CANDIDATE);
    }

    public ConversationMessageResponseDTO addAIMessage(UUID conversationId, String content) {
        return addMessage(conversationId, content, MessageRole.AI);
    }

    public ConversationMessageResponseDTO addSystemMessage(UUID conversationId, String content) {
        return addMessage(conversationId, content, MessageRole.SYSTEM);
    }

    private ConversationMessageResponseDTO addMessage(UUID conversationId, String content, MessageRole role) {
        Conversation conversation = conversationRepository
                .findById(conversationId)
                .orElseThrow(() -> new EntityNotFoundException("Conversation not found with id: " + conversationId));

        ConversationMessage message = new ConversationMessage();
        message.setConversation(conversation);
        message.setRole(role);
        message.setContent(content);

        ConversationMessage savedMessage = conversationMessageRepository.save(message);
        return conversationMapper.toConversationMessageResponseDTO(savedMessage);
    }

    @Transactional(readOnly = true)
    public ConversationHistoryResponseDTO getConversationHistory(UUID conversationId) {
        Conversation conversation = conversationRepository
                .findById(conversationId)
                .orElseThrow(() -> new EntityNotFoundException("Conversation not found with id: " + conversationId));

        List<ConversationMessageResponseDTO> messages = conversationMessageRepository
                .findByConversationOrderByCreatedAtAsc(conversation)
                .stream()
                .map(conversationMapper::toConversationMessageResponseDTO)
                .toList();

        return ConversationHistoryResponseDTO.builder()
                .conversationId(conversation.getId())
                .messages(messages)
                .build();
    }

    @Transactional(readOnly = true)
    public List<ConversationMessageResponseDTO> getLastNMessages(UUID conversationId, int n) {
        Conversation conversation = conversationRepository
                .findById(conversationId)
                .orElseThrow(() -> new EntityNotFoundException("Conversation not found with id: " + conversationId));

        return conversationMessageRepository
                .findByConversationOrderByCreatedAtDesc(conversation, PageRequest.of(0, n))
                .stream()
                .map(conversationMapper::toConversationMessageResponseDTO)
                .toList();
    }

}

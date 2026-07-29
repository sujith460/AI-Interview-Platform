package com.Ai_Interview_Platform.DSA.conversation.mapper;

import com.Ai_Interview_Platform.DSA.conversation.dto.ConversationMessageResponseDTO;
import com.Ai_Interview_Platform.DSA.conversation.dto.ConversationResponseDTO;
import com.Ai_Interview_Platform.DSA.conversation.entity.Conversation;
import com.Ai_Interview_Platform.DSA.conversation.entity.ConversationMessage;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ConversationMapper {

    @Mapping(target = "conversationId", source = "id")
    @Mapping(target = "interviewSessionId", source = "interviewSession.id")
    ConversationResponseDTO toConversationResponseDTO(
            Conversation conversation
    );

    @Mapping(target = "messageId", source = "id")
    ConversationMessageResponseDTO toConversationMessageResponseDTO(
            ConversationMessage message
    );

}
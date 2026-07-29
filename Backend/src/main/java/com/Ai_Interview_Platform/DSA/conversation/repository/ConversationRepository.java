package com.Ai_Interview_Platform.DSA.conversation.repository;

import com.Ai_Interview_Platform.DSA.conversation.entity.Conversation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface ConversationRepository extends JpaRepository<Conversation, UUID> {

    Optional<Conversation> findByInterviewSessionId(UUID interviewSessionId);

}
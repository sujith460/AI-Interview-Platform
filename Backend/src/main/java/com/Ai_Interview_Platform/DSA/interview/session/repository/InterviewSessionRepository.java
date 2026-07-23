package com.Ai_Interview_Platform.DSA.interview.session.repository;

import com.Ai_Interview_Platform.DSA.interview.session.entity.InterviewSession;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface InterviewSessionRepository extends JpaRepository<InterviewSession, UUID> {

}
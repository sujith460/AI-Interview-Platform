package com.Ai_Interview_Platform.DSA.analytics.repository;

import com.Ai_Interview_Platform.DSA.analytics.entity.UserAnalyticsCache;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserAnalyticsCacheRepository extends JpaRepository<UserAnalyticsCache, UUID> {
    Optional<UserAnalyticsCache> findByUserId(Long userId);
}

package com.Ai_Interview_Platform.DSA.analytics.controller;

import com.Ai_Interview_Platform.DSA.analytics.dto.UserAnalyticsResponseDTO;
import com.Ai_Interview_Platform.DSA.analytics.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping
    public ResponseEntity<UserAnalyticsResponseDTO> getUserAnalytics(
            @RequestParam(defaultValue = "false") boolean refresh) {
        UserAnalyticsResponseDTO analytics = analyticsService.getUserAnalytics(refresh);
        return ResponseEntity.ok(analytics);
    }

    @PostMapping("/refresh")
    public ResponseEntity<UserAnalyticsResponseDTO> refreshUserAnalytics() {
        UserAnalyticsResponseDTO analytics = analyticsService.getUserAnalytics(true);
        return ResponseEntity.ok(analytics);
    }
}

package com.Ai_Interview_Platform.DSA.coding.config;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class PistonConfig {

    @Value("${piston.api.base-url}")
    private String baseUrl;

    @Bean
    public WebClient pistonWebClient() {

        return WebClient.builder()
                .baseUrl(baseUrl)
                .build();
    }
}

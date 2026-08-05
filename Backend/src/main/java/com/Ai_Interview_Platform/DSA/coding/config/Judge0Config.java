package com.Ai_Interview_Platform.DSA.coding.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class Judge0Config {

    @Value("${judge0.api.base-url:http://localhost:2358}")
    private String baseUrl;

    @Bean
    public WebClient judge0WebClient() {
        return WebClient.builder()
                .baseUrl(baseUrl)
                .build();
    }
}

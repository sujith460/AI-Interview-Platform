package com.Ai_Interview_Platform.DSA.ai.properties;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

import java.time.Duration;

@Getter
@Setter
@ConfigurationProperties(prefix = "ai.api")
public class AIProperties {

    private String key;

    private String baseUrl;

    private String model;

    private Duration timeout;

   }
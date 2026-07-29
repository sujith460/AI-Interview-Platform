package com.Ai_Interview_Platform.DSA.ai.config;

import com.Ai_Interview_Platform.DSA.ai.properties.AIProperties;
import io.netty.channel.ChannelOption;
import io.netty.handler.timeout.ReadTimeoutHandler;
import io.netty.handler.timeout.WriteTimeoutHandler;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.netty.http.client.HttpClient;

import java.util.concurrent.TimeUnit;

@Configuration
@RequiredArgsConstructor
public class AIConfig {

    private final AIProperties aiProperties;

    @Bean
    public WebClient webClient() {

        HttpClient httpClient = HttpClient.create()
                .option(ChannelOption.CONNECT_TIMEOUT_MILLIS,
                        (int) aiProperties.getTimeout()  .toMillis())
                .doOnConnected(connection -> connection
                        .addHandlerLast(new ReadTimeoutHandler(
                                aiProperties.getTimeout().toSeconds(),
                                TimeUnit.SECONDS))
                        .addHandlerLast(new WriteTimeoutHandler(
                                aiProperties.getTimeout().toSeconds(),
                                TimeUnit.SECONDS)));

        return WebClient.builder()
                .baseUrl(aiProperties.getBaseUrl())
                .clientConnector(new ReactorClientHttpConnector(httpClient))
                .build();
    }
}
package com.jobbuilder.project.websocket.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;
import org.springframework.web.socket.server.HandshakeInterceptor;

import com.jobbuilder.project.websocket.handler.ChatWebSocketHandler;

import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSocket
@RequiredArgsConstructor
public class WebSocketConfig implements WebSocketConfigurer{

	private final HandshakeInterceptor handshakeInterceptor;
	
	private final ChatWebSocketHandler chatWebSocketHandler;
	
	@Override
	public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
		registry.addHandler(chatWebSocketHandler, "/chatSock").addInterceptors(handshakeInterceptor)
		.setAllowedOriginPatterns("http://localhost/",
								  "http://127.0.0.1",
								  "http://192.168.150.48",
								  "http://404notfun.store",
								  "http://13.124.153.205")
		// setAllowedOriginPatterns 는 도메인 구매 시 변경
		.withSockJS();
	}
}

package com.jobbuilder.project.websocket.handler;

import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class ChatWebSocketHandler extends TextWebSocketHandler{

	private Set<WebSocketSession> sessions = Collections.synchronizedSet(new HashSet<>());
	
	@Override
	public void afterConnectionEstablished(WebSocketSession session) throws Exception {
		// TODO Auto-generated method stub
		sessions.add(session);
	} 
	
	@Override
	public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
		// TODO Auto-generated method stub
		sessions.remove(session);
	}
	
	@Override
	protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
		// TODO Auto-generated method stub
		log.info("전달받은 메시티 : {}", message.getPayload());
		
		for(WebSocketSession s : sessions  ) {
			s.sendMessage(message);
		}
	}
}

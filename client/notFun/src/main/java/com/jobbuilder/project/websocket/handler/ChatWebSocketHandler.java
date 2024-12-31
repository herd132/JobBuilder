package com.jobbuilder.project.websocket.handler;

import java.lang.reflect.Member;
import java.text.SimpleDateFormat;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jobbuilder.project.chatting.model.dto.Message;
import com.jobbuilder.project.chatting.model.service.ChattingService;
import com.jobbuilder.project.counsel.model.dto.Counselor;
import com.jobbuilder.project.employer.model.dto.Employer;
import com.jobbuilder.project.worker.model.dto.Worker;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@RequiredArgsConstructor
public class ChatWebSocketHandler extends TextWebSocketHandler{
	
	private final ChattingService service;

	private Set<WebSocketSession> sessions = Collections.synchronizedSet(new HashSet<>());
	
	@Override
	public void afterConnectionEstablished(WebSocketSession session) throws Exception {
		// TODO Auto-generated method stub
		sessions.add(session);
		log.info("{} 연결됨", session.getId());
	} 
	
	@Override
	public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
		// TODO Auto-generated method stub
		sessions.remove(session);
		log.info("{} 연결끊김", session.getId());
		// 
		session.close(status);
		
	}
	
	@Override
	protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
		// TODO Auto-generated method stub

		ObjectMapper objectMapper = new ObjectMapper();
		
		Map<String, String> map = objectMapper.readValue(message.getPayload(), HashMap.class);
		
		if( map.get("counselEnd") != null ) {

			for(WebSocketSession s : sessions) {
				HttpSession temp = (HttpSession) s.getAttributes().get("session");
				
				// 로그인된 근로자 사업가 정보 중 회원 번호를 꺼내오기
				int loginWorkerNo = ((Worker)temp.getAttribute("loginWorker")) == null ? 0 : ((Worker)temp.getAttribute("loginWorker")).getMemberNo();
				int loginEmployer = ((Employer)temp.getAttribute("loginEmployer")) == null ? 0 : ((Employer)temp.getAttribute("loginEmployer")).getMemberNo();
				
				// 로그인 상태인 회원 중 targetNo 찾기
				if(loginWorkerNo == Integer.parseInt(map.get("targetNo")) || loginEmployer == Integer.parseInt(map.get("targetNo"))) {
					
					afterConnectionClosed(s, CloseStatus.NORMAL);
					return;
				}
			}
			return;
		}
		
		Message msg = objectMapper.readValue(message.getPayload(), Message.class);
		
		
		
		// DB 삽입 서비스 호출
		int result = service.insertMessage(msg);
		
		if(result > 0) {
			
			SimpleDateFormat sdf = new SimpleDateFormat("yyyy.MM.dd hh:mm");
			msg.setSendTime(sdf.format(new Date()));
			
			// 필드에 있는 sessions에는 접속중인 모든 회원의 세션 정보가 담겨있음
			for(WebSocketSession s : sessions) {
				
				// 가로챈 session 꺼내기 
				HttpSession temp = (HttpSession) s.getAttributes().get("session");
				
				// 로그인된 근로자 상담가 정보 중 회원 번호를 꺼내오기
				int loginWorkerNo = ((Worker)temp.getAttribute("loginWorker")) == null ? 0 : ((Worker)temp.getAttribute("loginWorker")).getMemberNo();
				int loginEmployer = ((Employer)temp.getAttribute("loginEmployer")) == null ? 0 : ((Employer)temp.getAttribute("loginEmployer")).getMemberNo();
				int loginCounselorNo = ((Counselor)temp.getAttribute("loginCounselor")) == null ? 0 : ((Counselor)temp.getAttribute("loginCounselor")).getMemberNo();
				
				// 로그인 상태인 회원 중 targetNo 또는 senderNo 일치하는 회원에게 메시지 전달
				if(loginWorkerNo == msg.getTargetNo() || loginWorkerNo == msg.getSenderNo() ||
					loginEmployer == msg.getTargetNo() || loginEmployer == msg.getSenderNo()||
					loginCounselorNo == msg.getTargetNo() || loginCounselorNo == msg.getSenderNo()) {
					
					// 다시 DTO(-> msg) 를 JSON으로 변환 (JS에 보내야하니까)
					String jsonData = objectMapper.writeValueAsString(msg);
					s.sendMessage(new TextMessage(jsonData));
				}
				
			}
			
			
		}
		
	}
}

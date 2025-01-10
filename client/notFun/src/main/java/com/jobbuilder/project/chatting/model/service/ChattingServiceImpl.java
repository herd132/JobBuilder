package com.jobbuilder.project.chatting.model.service;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.socket.TextMessage;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jobbuilder.project.chatting.model.dto.ChattingRoom;
import com.jobbuilder.project.chatting.model.dto.Message;
import com.jobbuilder.project.chatting.model.mapper.ChattingMapper;
import com.jobbuilder.project.websocket.handler.ChatWebSocketHandler;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
@Slf4j
public class ChattingServiceImpl implements ChattingService{

	private final ChattingMapper mapper;

	// 채팅 유저 목록 조회
	@Override
	public List<ChattingRoom> selectRoomList(int memberNo) {
		return mapper.selectRoomList(memberNo);
	}
	
	// 채팅창 조회
	@Override
    public List<Message> selectMessageList( Map<String, Integer> paramMap) {
		
        List<Message> messageList = mapper.selectMessageList( paramMap.get("chattingRoomNo") );
        
        if(!messageList.isEmpty()) { // 메시지 목록이 있다면
            int result = mapper.updateReadFlag(paramMap);
        }
        return messageList;
    }
	
	// 채팅 메세지 보내기
	@Override
	public int insertMessage(Message msg) {
		
		return mapper.insertMessage(msg);
	}
	
	// 읽음 처리
	@Override
	public int updateReadFlag(Map<String, Integer> paramMap) {
		
		return mapper.updateReadFlag(paramMap);
	}
	
	// 채팅 방 유무 확인
	@Override
	public int checkChattingRoomNo(Map<String, Integer> map) {
		
		int[] counselorNoArr = mapper.getRandomCounselorNo();
		
		Random random = new Random();
		
		int counselorNo = counselorNoArr[random.nextInt(counselorNoArr.length)];
		map.put("targetNo", counselorNo);
		
		int chattingRoomNo = mapper.checkChattingRoomNo(map);
		map.put("chattingRoomNo", chattingRoomNo);
		
		if( chattingRoomNo == 0) return 0;
			
		return chattingRoomNo;
	}
	
	// 채팅 방 생성
	@Override
	public int createChattingRoom(Map<String, Integer> map) {
		
		int result = mapper.createChattingRoom(map);
		
    	if(result > 0) {
    		
    		Message message = new Message();
    		ObjectMapper objectMapper = new ObjectMapper();
    		
    		message.setSenderNo(map.get("loginMemberNo"));
    		message.setTargetNo(map.get("targetNo"));
    		message.setMessageContent("새로운 채팅방이 생성되었습니다.");
    		
    		mapper.insertMessage(message);
    		
    		return (int)map.get("chattingRoomNo");
    	}
    	
        return 0;
	}
	
	// 상담종료
	@Override
	public int counselingEnd(Map<String, Object> map) {
		return mapper.counselingEnd(map);
	}
	
	// 메세지 가져오기
	@Override 
	public List<Map<String, String>> chatBotMessgeList(int authority) {
		// TODO Auto-generated method stub
		return mapper.chatBotMessgeList(authority);
	}
 
}

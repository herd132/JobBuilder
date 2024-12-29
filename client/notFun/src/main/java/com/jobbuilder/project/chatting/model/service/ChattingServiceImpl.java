package com.jobbuilder.project.chatting.model.service;

import java.util.List;
import java.util.Map;
import java.util.Random;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.jobbuilder.project.chatting.model.dto.ChattingRoom;
import com.jobbuilder.project.chatting.model.dto.Message;
import com.jobbuilder.project.chatting.model.mapper.ChattingMapper;

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
	public Map<String, Integer> checkChattingRoomNo(Map<String, Integer> map) {
		
		int[] counselorNoArr = mapper.getRandomCounselorNo();
		
		Random random = new Random();
		
		int counselorNo = counselorNoArr[random.nextInt(counselorNoArr.length)];
		map.put("targetNo", counselorNo);
		
		int chattingRoomNo = mapper.checkChattingRoomNo(map);
		
		if( chattingRoomNo != 0) map.put("chattingRoomNo", chattingRoomNo);
		
		return map;
	}
	
	// 채팅 방 생성
	@Override
	public int createChattingRoom(Map<String, Integer> map) {
		
		int result = mapper.createChattingRoom(map);
		
    	
    	if(result > 0) {
    		return result;
    	}
    	
        return 0;
	}
 
}

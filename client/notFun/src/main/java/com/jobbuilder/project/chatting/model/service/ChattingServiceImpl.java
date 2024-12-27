package com.jobbuilder.project.chatting.model.service;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

	@Override
	public List<ChattingRoom> selectRoomList(int memberNo) {
		return mapper.selectRoomList(memberNo);
	}
	
	// 채팅창 조회
	@Override
    public List<Message> selectMessageList( Map<String, Integer> paramMap) {
        log.debug("paramMap : " + paramMap);
        List<Message> messageList = mapper.selectMessageList( paramMap.get("chattingRoomNo") );
        log.debug("messageList : " + messageList);
        
        if(!messageList.isEmpty()) { // 메시지 목록이 있다면
            int result = mapper.updateReadFlag(paramMap);
        }
        return messageList;
    }
}

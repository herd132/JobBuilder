package com.jobbuilder.project.chatting.model.service;

import java.util.List;
import java.util.Map;

import com.jobbuilder.project.chatting.model.dto.ChattingRoom;
import com.jobbuilder.project.chatting.model.dto.Message;

public interface ChattingService {

	
	/** 상담가에게 온 문의 리스트 조회
	 * @param memberNo 
	 * @return
	 */
	List<ChattingRoom> selectRoomList(int memberNo);

	/** 채팅 상세 내용 가져오기
	 * @param paramMap
	 * @return
	 */
	List<Message> selectMessageList(Map<String, Integer> paramMap);

	/** 채팅방 목록 가져오기
	 * @param msg
	 * @return
	 */
	int insertMessage(Message msg);

	/** 채팅방 읽음 처리
	 * @param paramMap
	 * @return
	 */
	int updateReadFlag(Map<String, Integer> paramMap);

}

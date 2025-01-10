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

	/**채팅 방 룸 유무 체크
	 * @param map
	 * @return
	 */
	int checkChattingRoomNo(Map<String, Integer> map);

	/** 유무 체크 후 없을 시 생성
	 * @param map
	 * @return
	 */
	int createChattingRoom(Map<String, Integer> map);

	/** 상담 종료
	 * @param map
	 * @return
	 */
	int counselingEnd(Map<String, Object> map);

	/** 챗봇 메세지 가져오기
	 * @param authority
	 * @return
	 */
	List<Map<String, String>> chatBotMessgeList(int authority);

}

package com.jobbuilder.project.chatting.model.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import com.jobbuilder.project.chatting.model.dto.ChattingRoom;
import com.jobbuilder.project.chatting.model.dto.Message;

@Mapper
public interface ChattingMapper {

	// 채팅 방 조회
	List<ChattingRoom> selectRoomList(int memberNo);

	// 채팅방 대화 가져오기
	List<Message> selectMessageList(Object object);

	// 읽음 처리
	int updateReadFlag(Map<String, Integer> paramMap);

	// 채팅 메세지 보내기
	int insertMessage(Message msg);
	
	// 상담원 번호 얻기
	int[] getRandomCounselorNo();

	// 채팅방 유무
	int checkChattingRoomNo(Map<String, Integer> map);

	// 채팅방 생성
	int createChattingRoom(Map<String, Integer> map);

	// 상담종료
	int counselingEnd(Map<String, Object> map);

	// 챗봇 메세지 가져오기
	List<Map<String, String>> chatBotMessgeList(int authority);

	// 채팅방 완료 여부 N 표시
	int enterReadFlag(int chattingRoomNo);


}

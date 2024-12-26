package com.jobbuilder.project.chatting.model.service;

import java.util.List;

import com.jobbuilder.project.chatting.model.dto.ChattingRoom;

public interface ChattingService {

	
	/** 상담가에게 온 문의 리스트 조회
	 * @param memberNo
	 * @return
	 */
	List<ChattingRoom> selectRoomList(int memberNo);

}

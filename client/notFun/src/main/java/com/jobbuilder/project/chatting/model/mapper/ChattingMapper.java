package com.jobbuilder.project.chatting.model.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.jobbuilder.project.chatting.model.dto.ChattingRoom;

@Mapper
public interface ChattingMapper {

	// 채팅 방 조회
	List<ChattingRoom> selectRoomList(int memberNo);

}

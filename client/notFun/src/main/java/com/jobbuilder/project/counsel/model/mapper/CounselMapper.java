package com.jobbuilder.project.counsel.model.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.jobbuilder.project.chatting.model.dto.ChattingRoom;
import com.jobbuilder.project.counsel.model.dto.Counselor;

@Mapper
public interface CounselMapper {

	// 로그인 확인
	Counselor loginCounselor(Counselor inputCounselor);

}

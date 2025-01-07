package com.jobbuilder.project.board.model.service;

import java.util.List;

import com.jobbuilder.project.board.model.dto.CommentBoard;
import com.jobbuilder.project.board.model.dto.OneTalk;

public interface OneTalkService {

	List<OneTalk> select(); // 한줄톡 조회

	int insert(OneTalk oneTalk); // 한줄톡 등록

	int delete(int oneTalkNoBoard); // 한줄톡 삭제

	int update(OneTalk oneTalk); // 한줄톡 수정

}

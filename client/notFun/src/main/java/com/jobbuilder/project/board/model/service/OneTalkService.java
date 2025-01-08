package com.jobbuilder.project.board.model.service;

import java.util.List;
import java.util.Map;

import com.jobbuilder.project.board.model.dto.CommentBoard;
import com.jobbuilder.project.board.model.dto.OneTalk;

public interface OneTalkService {

	 
	  
	Map<String, Object> selectOneTalkList(int cp); // 한줄톡톡 리스트
	int insert(OneTalk oneTalk);		// 삽입
	int delete(int oneTalkNoBoard);		// 수정
	int update(OneTalk oneTalk);		// 삭제
	List<OneTalk> select();				// 비동기 한줄톡톡 조회
	


}

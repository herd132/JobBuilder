package com.jobbuilder.project.board.model.service;

import java.util.List;
import java.util.Map;

import com.jobbuilder.project.board.model.dto.Board;

public interface BoardService {
	// 게시글 목록 조회
	Map<String, Object> selectBoardList(int boardCode, int cp);
	// 검색시 게시글 목록 조회
	Map<String, Object> searchList(Map<String, Object> paramMap, int cp);
	
	// 게시판 종류 조회
	List<Map<String, Object>> selectBoardTypeList();
	// 게시글 상세 조회
	Board selectOne(Map<String, Integer> map);
	// 조회수 업데이트 ( 1증가 ) 
	int updateReadCount(int boardNo);

}

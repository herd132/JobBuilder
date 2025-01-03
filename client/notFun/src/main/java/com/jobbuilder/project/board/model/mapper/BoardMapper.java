package com.jobbuilder.project.board.model.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.session.RowBounds;

import com.jobbuilder.project.board.model.dto.Board;

@Mapper
public interface BoardMapper {

	// 게시글 수 조회
	int getListCount(int boardCode);

	// 게시판 목록 조회
	List<Board> selectBoardList(int boardCode, RowBounds rowBounds);

	// 게시판 종류 조회
	List<Map<String, Object>> selectBoardTypeList();

	// 게시글 상세 조회 ( 고용주가 쓴 글일 경우 )
	Board selectOneEmploy(Map<String, Integer> map);
	// 조회수 1 증가
	int updateReadCount(int boardNo);

	// 조회수 조회
	int selectReadCount(int boardNo);

	// 게시글 상세 조회
	Board selectOne(Map<String, Integer> map);

}

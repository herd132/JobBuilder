package com.jobbuilder.project.board.model.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.RowBounds;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.jobbuilder.project.board.model.dto.Board;
import com.jobbuilder.project.board.model.dto.Pagination;
import com.jobbuilder.project.board.model.mapper.BoardMapper;
import com.jobbuilder.project.employer.model.dto.Employer;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
@Slf4j
public class BoardServiceImpl implements BoardService{

	private final BoardMapper mapper;
	
	// 게시판 종류 조회
	@Override
	public List<Map<String, Object>> selectBoardTypeList() {
		
		return mapper.selectBoardTypeList(); 
	}
	
	
	// 특정 게시판 지정된 페이지 목록 조회
	@Override
	public Map<String, Object> selectBoardList(int boardCode, int cp) {
		int listCount = mapper.getListCount(boardCode);
		if(listCount < (cp * 10)) cp = 1;
		
		Pagination pagination = new Pagination(cp, listCount);
				
	
		int limit = pagination.getLimit() ; //  10개
		int offset = (cp - 1 ) * limit;
		RowBounds rowBounds = new RowBounds(offset, limit);

		List<Board> boardList = mapper.selectBoardList(boardCode, rowBounds);
		
		// 4. 목록 조회 결과 + Pagination 객체를 Map으로 묵음
		Map<String, Object> map = new HashMap<>();
		
		map.put("pagination", pagination);
		map.put("boardList", boardList);
		
		// 5. 결과 반환		
		
		return map;
	}
	
	// 검색 서비스
	@Override
	public Map<String, Object> searchList(Map<String, Object> paramMap, int cp) {
		return null;
	}
	
	// 상세조회 서비스
	@Override
	public Board selectOne(Map<String, Integer> map) {
		// TODO Auto-generated method stub
		return mapper.selectOne(map);
	}
	

	// 게시글 조회 수 1 증가
	@Override
	public int updateReadCount(int boardNo) {
		// 1. 조회 수 1 증가 ( UPDATE )
				int result = mapper.updateReadCount(boardNo);
						
				// 2. 현재 조회 수 조회
				if(result > 0) {
					return mapper.selectReadCount(boardNo);
				}
						
				
				// 실패한 경우 -1 반환
					
				return -1;
	}
	
	
}

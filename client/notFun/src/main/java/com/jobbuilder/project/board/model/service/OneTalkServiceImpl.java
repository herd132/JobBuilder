package com.jobbuilder.project.board.model.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.RowBounds;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.jobbuilder.project.board.model.dto.Board;
import com.jobbuilder.project.board.model.dto.OneTalk;
import com.jobbuilder.project.board.model.dto.Pagination;
import com.jobbuilder.project.board.model.mapper.OneTalkMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
@Slf4j
public class OneTalkServiceImpl implements OneTalkService {
	
	private final OneTalkMapper mapper;
	
	@Override
	public Map<String, Object> selectOneTalkList( int cp ) {
		int listCount = mapper.getListCount();
		if(listCount < (cp * 10)) cp = 1;
		
		Pagination pagination = new Pagination(cp, listCount);
				
	
		int limit = pagination.getLimit() ; //  10개
		int offset = (cp - 1 ) * limit;
		RowBounds rowBounds = new RowBounds(offset, limit);

		List<OneTalk> oneTalkList = mapper.selectOneTalkList(rowBounds);
		
		// 4. 목록 조회 결과 + Pagination 객체를 Map으로 묵음
		Map<String, Object> map = new HashMap<>();
		
		map.put("pagination", pagination);
		map.put("oneTalkList", oneTalkList);
		log.debug("로그디버그" + oneTalkList);
		// 5. 결과 반환		
		
		return map;
	}

	@Override
	public int insert(OneTalk oneTalk) {
		// TODO Auto-generated method stub
		return 0;
	}

	@Override
	public int delete(int oneTalkNoBoard) {
		// TODO Auto-generated method stub
		return 0;
	}

	@Override
	public int update(OneTalk oneTalk) {
		// TODO Auto-generated method stub
		return 0;
	}
	

}

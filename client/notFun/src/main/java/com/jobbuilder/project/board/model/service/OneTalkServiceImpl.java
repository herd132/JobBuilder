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
	public Map<String, Object> selectOneTalkList(int cp) {
		int listCount = mapper.getListCount();
		String ex = "";
		
		Pagination pagination = new Pagination(cp, listCount);
				
	
		int limit = pagination.getLimit() ; //  10개
		int offset = (cp - 1 ) * limit;
		RowBounds rowBounds = new RowBounds(offset, limit);

		List<OneTalk> oneTalkList = mapper.selectOneTalkList(ex ,rowBounds);
		
		
		// 4. 목록 조회 결과 + Pagination 객체를 Map으로 묵음
		Map<String, Object> map = new HashMap<>();
		
		map.put("pagination", pagination);
		map.put("oneTalkList", oneTalkList);
		
		// 5. 결과 반환		
		
		return map;
	}

	// 한줄톡톡 내용 조회
	@Override
	public List<OneTalk> select() {
		return mapper.select();
	}
	
	@Override
	public int insert(OneTalk oneTalk) {
		// TODO Auto-generated method stub
		return mapper.insert(oneTalk);
	}

	@Override
	public int delete(int oneTalkNo) {
		// TODO Auto-generated method stub
		return mapper.delete(oneTalkNo);
	}

	@Override
	public int update(OneTalk oneTalk) {
		// TODO Auto-generated method stub
		return mapper.update(oneTalk);
	}
	

}

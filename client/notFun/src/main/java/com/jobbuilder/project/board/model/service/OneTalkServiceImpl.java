package com.jobbuilder.project.board.model.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.jobbuilder.project.board.model.dto.CommentBoard;
import com.jobbuilder.project.board.model.dto.OneTalk;
import com.jobbuilder.project.board.model.mapper.OneTalkMapper;

import lombok.RequiredArgsConstructor;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
public class OneTalkServiceImpl implements OneTalkService {
	
	private final OneTalkMapper mapper;
	
	@Override
	public List<OneTalk> select() {
		
		return mapper.select();
	}
	
	@Override
	public int insert(OneTalk oneTalk) {
		
		return mapper.insert(oneTalk);
	}
	
	@Override
	public int delete(int oneTalkNoBoard) {
		
		return mapper.delete(oneTalkNoBoard);
	}
	
	@Override
	public int update(OneTalk oneTalk) {
	
		return mapper.update(oneTalk);
	}
}

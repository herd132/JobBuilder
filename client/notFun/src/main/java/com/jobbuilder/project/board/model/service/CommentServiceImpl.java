package com.jobbuilder.project.board.model.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.jobbuilder.project.board.model.dto.CommentBoard;
import com.jobbuilder.project.board.model.mapper.CommentBoardMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
@Slf4j
public class CommentServiceImpl implements CommentService{

	private final CommentBoardMapper mapper;

	@Override
	public List<CommentBoard> select(int boardNo) {
		
		return mapper.select(boardNo);
	}

	@Override
	public int insert(CommentBoard comment) {
		
		return mapper.insert(comment);
	}

	@Override
	public int delete(int commentNoBoard) {
		return mapper.delete(commentNoBoard);
	}

	@Override
	public int update(CommentBoard comment) {
		return mapper.update(comment);
	}
}

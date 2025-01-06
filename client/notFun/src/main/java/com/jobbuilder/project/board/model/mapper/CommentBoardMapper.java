package com.jobbuilder.project.board.model.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.jobbuilder.project.board.model.dto.CommentBoard;

@Mapper
public interface CommentBoardMapper {

	List<CommentBoard> select(int boardNo);

	int insert(CommentBoard comment);

	int delete(int commentNoBoard);

	int update(CommentBoard comment);

}

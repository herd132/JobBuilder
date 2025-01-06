package com.jobbuilder.project.board.model.service;

import java.util.List;

import com.jobbuilder.project.board.model.dto.CommentBoard;

public interface CommentService {

	List<CommentBoard> select(int boardNo); // 댓글조회

	int insert(CommentBoard comment); // 댓글등록

	int delete(int commentNoBoard); // 댓글삭제

	int update(CommentBoard comment); // 댓글수정

}

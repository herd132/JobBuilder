package com.jobbuilder.project.board.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.jobbuilder.project.board.model.dto.CommentBoard;
import com.jobbuilder.project.board.model.service.CommentService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("comment")
@RequiredArgsConstructor
@Slf4j
public class CommentController {

	private final CommentService service;
	
	// 댓글 조회
	@GetMapping("")
	public List<CommentBoard> select(@RequestParam("boardNo") int boardNo) {
		
		// HttpMessageConverter가
		// List -> JSON(문자열)로 변환해서 응답 -> JS
		log.debug("코멘트" + service.select(boardNo));
		
		return service.select(boardNo);
	}
	// 댓글 등록
	@PostMapping("")
	public int insert(@RequestBody CommentBoard comment) {
		return service.insert(comment);
	}
	// 댓글 삭제
	@DeleteMapping("")
	public int delete(@RequestBody int commentNoBoard) {
		return service.delete(commentNoBoard);
	}
	// 댓글 수정
	@PutMapping("")
	public int update(@RequestBody CommentBoard comment) {
		return service.update(comment);
	}
}

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

import com.jobbuilder.project.board.model.dto.OneTalk;
import com.jobbuilder.project.board.model.service.OneTalkService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("oneTalk")
@RequiredArgsConstructor
@Slf4j
public class OneTalkController {
	private final OneTalkService service;
	
		
		// 한줄톡 조회
		@GetMapping("")
		public List<OneTalk> select() {
			
			// HttpMessageConverter가
			// List -> JSON(문자열)로 변환해서 응답 -> JS
			return service.select();
		}
		// 한줄톡 등록
		@PostMapping("")
		public int insert(@RequestBody OneTalk oneTalk) {
			return service.insert(oneTalk);
		}
		// 한줄톡 삭제
		@DeleteMapping("")
		public int delete(@RequestBody int oneTalkNoBoard) {
			return service.delete(oneTalkNoBoard);
		}
		// 한줄톡 수정
		@PutMapping("")
		public int update(@RequestBody OneTalk oneTalk) {
			return service.update(oneTalk);
		}
}

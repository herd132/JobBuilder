package com.jobbuilder.project.board.controller;

import java.util.Map;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.SessionAttribute;

import com.jobbuilder.project.board.model.dto.OneTalk;
import com.jobbuilder.project.board.model.service.OneTalkService;
import com.jobbuilder.project.employer.model.dto.Employer;
import com.jobbuilder.project.worker.model.dto.Worker;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Controller
@RequestMapping("oneTalk")
@RequiredArgsConstructor
@Slf4j
public class OneTalkController {
	
	private final OneTalkService service;	
		
		// 한줄 톡톡 페이지 이동
		@GetMapping("main")
		public String select(
				@SessionAttribute(value = "loginWorker", required = false) Worker loginWorker,							
				@SessionAttribute(value = "loginEmployer", required = false) Employer loginEmployer,				
				@RequestParam(value = "cp", required = false, defaultValue = "1") int cp, 				
				Model model ) {
			
			Map<String, Object> map = null;
			
			map = service.selectOneTalkList(cp); 			
			
			model.addAttribute("pagination", map.get("pagination"));
			model.addAttribute("oneTalkList" , map.get("oneTalkList"));
			
			return "board/oneTalk";
		}
		// 한줄톡 등록
		@PostMapping("")	
		@ResponseBody
		public int insert(@RequestBody OneTalk oneTalk) {
			return service.insert(oneTalk);
		}
		// 한줄톡 삭제
		@DeleteMapping("")
		@ResponseBody
		public int delete(@RequestBody int oneTalkNoBoard) {
			return service.delete(oneTalkNoBoard);
		}
		// 한줄톡 수정
		@PutMapping("")
		@ResponseBody
		public int update(@RequestBody OneTalk oneTalk) {
			return service.update(oneTalk);
		}
}

package com.jobbuilder.project.chatting.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.SessionAttribute;
import org.springframework.web.bind.annotation.SessionAttributes;

import com.jobbuilder.project.chatting.model.service.ChattingService;
import com.jobbuilder.project.counsel.model.dto.Counselor;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Controller
@RequestMapping("chat")
@RequiredArgsConstructor
@Slf4j
@SessionAttributes("loginCounselor")
public class ChattingController {
	
	private final ChattingService service;
	
	@GetMapping("/main")
	public String chattingMain(@SessionAttribute(name = "loginCounselor", required = false) Counselor counselor) {
		
		if(counselor == null ) {
			return "redirect:/counsel/login";
		}
		
		return "chatting/counselMain";
	}

}
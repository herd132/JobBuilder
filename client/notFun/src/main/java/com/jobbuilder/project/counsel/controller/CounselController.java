package com.jobbuilder.project.counsel.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.SessionAttributes;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.jobbuilder.project.counsel.model.dto.Counselor;
import com.jobbuilder.project.counsel.model.service.CounselService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Controller
@RequiredArgsConstructor
@Slf4j
@RequestMapping("counsel")
@SessionAttributes("loginCounselor")
public class CounselController {
	
	@Autowired
	private final CounselService service;
	
	@GetMapping("/login")
	public String counselLogin() {
		
		return "chatting/counselor/login";
	}
	
	@PostMapping("login")
	public String counselorLogin(Counselor inputCounselor
								, Model model
								, RedirectAttributes ra) {
		
		String path = "redirect:";
		String message = null;

		Counselor loginCounselor = service.loginCounselor(inputCounselor);
		
		if( loginCounselor != null  ) {
			path += "/chat/main";
			model.addAttribute("loginCounselor", loginCounselor);
		} else {
			path += "login";
			message = "이메일이나 비밀번호가 일치하지 않습니다.";
			
			ra.addFlashAttribute("message", message);
		}
		
		return path;
	}
}

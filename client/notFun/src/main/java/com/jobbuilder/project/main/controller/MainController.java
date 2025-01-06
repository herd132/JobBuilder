package com.jobbuilder.project.main.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.SessionAttributes;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import jakarta.servlet.http.HttpServletResponse;

@Controller
public class MainController {
	
	@RequestMapping("/")
	public String mainPage(HttpServletResponse resp) {
		return "main";
	}
	
	@RequestMapping("multiSignUp")
	public String multiSignUp(HttpServletResponse resp) {
		return "multiSignUp";
	}
	
	@RequestMapping("multiLogin")
	public String multiLogin() {
		return "multiLogin";
	}
	
	@GetMapping("loginError")
	public String loginError(RedirectAttributes ra) {
		ra.addFlashAttribute("message","로그인 후 이용해 주세요~");
		return "redirect:/multiLogin";
	}
	
}

package com.jobbuilder.project.main.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

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
	
}

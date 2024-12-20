package com.jobbuilder.project.test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

import com.jobbuilder.project.test.model.service.TestService;

import lombok.extern.slf4j.Slf4j;

@Controller
@Slf4j
public class TestController {
	
	@Autowired
	private TestService service;

	@RequestMapping("/")
	public String main(Model model) {
		
		return "test";
	}
	
	@RequestMapping("/test")
	public String test(Model model) {
		
		int num = service.getNum();
		
		model.addAttribute("message", num);
		return "test";
	}
}

package com.jobbuilder.project.resume.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("resume")
public class RecommendResume {

	@GetMapping("recommend")
	public String recommend() {
		return "resume/recommend";
	}
}

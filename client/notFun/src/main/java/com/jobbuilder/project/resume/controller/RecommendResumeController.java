package com.jobbuilder.project.resume.controller;

import java.util.List;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.jobbuilder.project.resume.model.dto.Resume;
import com.jobbuilder.project.resume.model.service.RecommendService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Controller
@RequestMapping("recommend")
@Slf4j
@RequiredArgsConstructor
public class RecommendResumeController {
	
	public final RecommendService service;

	@GetMapping("resume")
	@ResponseBody
	public List<Resume> recommend() {
		
//		List<Resume> list = service.revommendResumeList();
		List<Resume> list = null;
		
		return list;
	}
}

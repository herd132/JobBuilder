package com.jobbuilder.project.counsel.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import com.jobbuilder.project.counsel.model.dto.Counselor;
import com.jobbuilder.project.counsel.model.service.CounselService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Controller
@RequiredArgsConstructor
@Slf4j
@RequestMapping("counsel")
public class CounselController {
	
	@Autowired
	private final CounselService service;
	
	@GetMapping("/")
	public String counselLogin() {
		
		Counselor test = service.get(20);
		
		log.debug("test : " + test);
		
		return "chatting/counselor/login";
	}
}

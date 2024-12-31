package com.jobbuilder.project.serviceCenter.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import com.jobbuilder.project.serviceCenter.model.service.ServiceCenterService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Controller
@RequiredArgsConstructor
@RequestMapping("serviceCenter")
public class ServiceCenterController {

	private final ServiceCenterService service;
	
	// 공지사항으로 이동
	@GetMapping("notice")
	public String notice() {
		return "serviceCenter/notice";
	}

	// FAQ로 이동
	@GetMapping("faq")
	public String faq() {
		return "serviceCenter/FAQ";
	}
	
}

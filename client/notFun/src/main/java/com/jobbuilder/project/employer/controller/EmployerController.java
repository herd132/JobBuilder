package com.jobbuilder.project.employer.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import com.jobbuilder.project.employer.model.service.EmployerService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Controller
@RequestMapping("employer")
@RequiredArgsConstructor
@Slf4j
public class EmployerController {
	
	/* ********** 필드 ********** */
	private final EmployerService service;

	/* ********** 메서드 ********** */

	@GetMapping("employerSignUp")
	public String EmployerSignup() {
		return "employer/employerSignUp";
	}
}

package com.jobbuilder.project.employer.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.jobbuilder.project.employer.model.service.EmployerService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Controller
@RequestMapping("employer")
@RequiredArgsConstructor
@Slf4j
public class EmployerController {
	
	private final EmployerService service;

}

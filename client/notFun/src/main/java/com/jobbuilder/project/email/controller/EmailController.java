package com.jobbuilder.project.email.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.jobbuilder.project.email.model.service.EmailService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Controller
@RequestMapping("email")
@RequiredArgsConstructor
@Slf4j
public class EmailController {
	
	private final EmailService service;

}

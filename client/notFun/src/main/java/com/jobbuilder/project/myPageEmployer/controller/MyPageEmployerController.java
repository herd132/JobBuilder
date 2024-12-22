package com.jobbuilder.project.myPageEmployer.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.jobbuilder.project.myPageEmployer.model.service.MyPageEmployerService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Controller
@RequestMapping("myPageEmployer")
@RequiredArgsConstructor
@Slf4j
public class MyPageEmployerController {
	
	private final MyPageEmployerService service;

}

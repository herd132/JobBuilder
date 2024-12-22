package com.jobbuilder.project.recruitment.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.jobbuilder.project.recruitment.model.serivce.RecruitmentService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Controller
@RequestMapping("recruitment")
@RequiredArgsConstructor
@Slf4j
public class RecruitmentController {

	private final RecruitmentService service;
}

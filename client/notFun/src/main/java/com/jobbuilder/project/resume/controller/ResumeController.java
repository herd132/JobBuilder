package com.jobbuilder.project.resume.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.jobbuilder.project.resume.model.service.ResumeService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Controller
@RequestMapping("resume")
@RequiredArgsConstructor
@Slf4j
public class ResumeController {

	private final ResumeService service;
}

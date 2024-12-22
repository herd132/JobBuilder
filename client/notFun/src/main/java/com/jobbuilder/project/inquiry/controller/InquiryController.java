package com.jobbuilder.project.inquiry.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.jobbuilder.project.inquiry.model.service.InquiryService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Controller
@RequestMapping("inquiry")
@RequiredArgsConstructor
@Slf4j
public class InquiryController {

	private final InquiryService service;
}

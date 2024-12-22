package com.jobbuilder.project.chatting.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.jobbuilder.project.chatting.model.service.ChattingService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Controller
@RequestMapping("chatting")
@RequiredArgsConstructor
@Slf4j
public class ChattingController {
	
	private final ChattingService service;

}

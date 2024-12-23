package com.jobbuilder.project.myPageWorker.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.SessionAttributes;

import com.jobbuilder.project.myPageWorker.model.service.MyPageWorkerService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Controller
@RequestMapping("myPageWorker")
@SessionAttributes({"loginMember"})
@RequiredArgsConstructor
@Slf4j
public class MyPageWorkerController {

	private final MyPageWorkerService service;
}

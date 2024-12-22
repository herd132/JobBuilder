package com.jobbuilder.project.worker.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.jobbuilder.project.worker.model.service.WorkerService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Controller
@RequestMapping("worker")
@RequiredArgsConstructor
@Slf4j
public class WorkerController {

	private final WorkerService service;
}

package com.jobbuilder.project.board.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.jobbuilder.project.board.model.service.EditBoardService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Controller
@RequestMapping("editBoard")
@RequiredArgsConstructor
@Slf4j
public class EditBoardController {

	private final EditBoardService service;
	
}

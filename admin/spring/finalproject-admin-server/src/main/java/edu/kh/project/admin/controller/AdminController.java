package edu.kh.project.admin.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;

import edu.kh.project.admin.model.service.AdminService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Controller
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("admin")
@RequiredArgsConstructor
@Slf4j
public class AdminController {
	
	private final AdminService service;

}

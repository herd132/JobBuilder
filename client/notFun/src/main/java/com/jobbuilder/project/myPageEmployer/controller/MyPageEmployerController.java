package com.jobbuilder.project.myPageEmployer.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.SessionAttribute;
import org.springframework.web.bind.annotation.SessionAttributes;

import com.jobbuilder.project.employer.model.dto.Employer;
import com.jobbuilder.project.myPageEmployer.model.service.MyPageEmployerService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Controller
@RequestMapping("myPageEmp")
@SessionAttributes({"loginEmployer"})
@RequiredArgsConstructor
@Slf4j
public class MyPageEmployerController {
	
	/* ********** 필드 ********** */
	private final MyPageEmployerService service;
	
	/* ********** 메서드 ********** */
	
	/** 고용주 마이페이지 이동(get)
	 * @return
	 * @author JWJ
	 */
	@GetMapping("info")
	public String MyPageEmpInfo(@SessionAttribute("loginEmployer") Employer loginEmployer,
								Model model) {
		log.debug("loginEmployer : " + loginEmployer);
		
		return "myPageEmployer/info";
	}

}

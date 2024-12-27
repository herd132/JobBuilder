package com.jobbuilder.project.myPageWorker.controller;


import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.SessionAttribute;
import org.springframework.web.bind.annotation.SessionAttributes;

import com.jobbuilder.project.myPageWorker.model.service.MyPageWorkerService;
import com.jobbuilder.project.worker.model.dto.Worker;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;


@Controller
@RequestMapping("myPageWorkee")
@RequiredArgsConstructor
@Slf4j
@SessionAttributes({ "loginMember" })
public class MyPageWorkerController {

	private final MyPageWorkerService service;
	
	
	@GetMapping("myPageWorkerInfo")
	public String myPageWorkerInfo() {
		return "myPageWorker/info";
	}
	
	@GetMapping("updateInfo")
	public String updateInfo() {
		return "myPageWorker/updateInfo";
	}
	
	@GetMapping("myPageWorkerSecession")
	public String myPageWorkerSecession() {
		return "myPageWorker/secession";
	}
	
	@GetMapping("myPageWorkerChangePw")
	public String myPageWorkerChangePw() {
		return "myPageWorker/changePw";
	}
	
	@ResponseBody
	@GetMapping("checkNickname")
	public int checkNickname(@RequestParam("workerNickname") String workerNickname ) {
		return service.checkNickname(workerNickname);
	}
	
	@ResponseBody
	@GetMapping("checkMemberTel")
	public int checkMemberTel(@RequestParam("memberTel") String memberTel) {
		return service.checkMemberTel(memberTel);
	}
	
	@ResponseBody
	@PostMapping("checkPw")
	public int checkPw(@RequestBody String currentPassword, @SessionAttribute("loginWorker") Worker loginWorker) {
		log.debug("비밀번호는 : " +currentPassword);
				return service.checkPw(currentPassword,loginWorker);
		
	}
}

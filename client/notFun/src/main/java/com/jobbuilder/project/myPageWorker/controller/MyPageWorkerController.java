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
	
	
	/**
	 * @return 회원정보 페이지 이동
	 */
	@GetMapping("myPageWorkerInfo")
	public String myPageWorkerInfo() {
		return "myPageWorker/info";
	}
	
	
	/**
	 * @return 회원 정보 수정 페이지 이동
	 */
	@GetMapping("updateInfo")
	public String updateInfo() {
		return "myPageWorker/updateInfo";
	}
	
	/**
	 * @return 회원탈퇴
	 */
	@GetMapping("myPageWorkerSecession")
	public String myPageWorkerSecession() {
		return "myPageWorker/secession";
	}
	
	/**
	 * @return 비밀번호 변경 페이지 이동
	 */
	@GetMapping("myPageWorkerChangePw")
	public String myPageWorkerChangePw() {
		return "myPageWorker/changePw";
	}

	
	/**
	 * @param workerNickname
	 * @return 닉네임 유효성 검사
	 */
	@ResponseBody
	@GetMapping("checkNickname")
	public int checkNickname(@RequestParam("workerNickname") String workerNickname ) {
		return service.checkNickname(workerNickname);
	}
	
	/**
	 * @param memberTel
	 * @return 연락처 유효성 검사
	 */
	@ResponseBody
	@GetMapping("checkMemberTel")
	public int checkMemberTel(@RequestParam("memberTel") String memberTel) {
		return service.checkMemberTel(memberTel);
	}
	
	/**
	 * @param currentPassword
	 * @param loginWorker 현재 비밀번호 확인
	 * @return
	 */
	@ResponseBody
	@PostMapping("checkPw")
	public int checkPw(@RequestBody String currentPassword, @SessionAttribute("loginWorker") Worker loginWorker) {
				int result = service.checkPw(currentPassword,loginWorker);
				return result;
	}
}

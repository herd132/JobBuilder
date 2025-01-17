package com.jobbuilder.project.email.controller;

import java.util.Map;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.jobbuilder.project.email.model.service.EmailService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Controller
@RequestMapping("email")
@RequiredArgsConstructor
@Slf4j
public class EmailController {
	
	private final EmailService service;

	// 이메일 회원가입
	@ResponseBody
	@PostMapping("signup")
	public int signup(@RequestBody String email) {
		
	String authKey = service.sendEmail("signUpWor", email);
		
		if(authKey != null) { // 인증번호가 반환되어 돌아옴 == 이메일 보내기 성공
						return 1;
		}
		
		// 이메일 보내기 실패
		return 0;	
	}
	
	// 인증번호 확인
	@ResponseBody
	@PostMapping("checkAuthKey")
	public int checkAuthKey(@RequestBody Map<String, String> map ) {
		
		
		return service.checkAuthKey(map);
	}
}

package com.jobbuilder.project.email.controller;

import java.util.Map;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.jobbuilder.project.email.model.service.WookjaeEmailService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Controller
@RequestMapping("emailEmp")
@RequiredArgsConstructor
@Slf4j
public class WookjaeEmailController {

	/* ********** 필드 ********** */
	private final WookjaeEmailService service;
	
	/* ********** 메서드 ********** */
	
	/** AUTH_KEY 에 이메일, 인증키 수정 또는 생성
	 * @param email
	 * @return
	 * @author JWJ
	 */
	@ResponseBody
	@PostMapping("signUp")
	private int signUpEmp(@RequestBody String email) {
		String authKey = service.sendEmail("signUpEmp", email);
		
		if(authKey != null) return 1;
		return 0;
	}
	
	/** 고용주가 비밀번호 찾기 시 이메일 보내기
	 * @param email
	 * @return
	 */
	@ResponseBody
	@PostMapping("findPw")
	private int findPwEmp(@RequestBody String email) {
		String authKey = service.sendEmail("findPwEmp", email);
		
		if(authKey != null) return 1;
		return 0;
	}
	
	
	/** 인증번호 확인
	 * @param map(email, authKey)
	 * @return
	 * @author JWJ
	 */
	@ResponseBody
	@PostMapping("checkAuthKey")
	private int checkAuthKey(@RequestBody Map<String, String> map) {
		return service.checkAuthKey(map);
	}
}

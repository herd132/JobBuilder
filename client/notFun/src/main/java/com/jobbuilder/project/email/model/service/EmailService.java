package com.jobbuilder.project.email.model.service;

import java.util.Map;

public interface EmailService {

	// 이메일 회원가입 발송
	String sendEmail(String string, String email);

	// 이메일 중복확인
	int checkAuthKey(Map<String, String> map);

}

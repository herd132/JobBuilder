package com.jobbuilder.project.email.model.service;

import java.util.Map;

public interface WookjaeEmailService {

	/** AUTH_KEY 에 이메일, 인증키 수정 또는 생성
	 * @param htmlName(이메일에 보낼 html 파일이름)
	 * @param email(회원가입하려는 고용주의 이메일)
	 * @return
	 * @author JWJ
	 */
	String sendEmail(String htmlName, String email);

	/** 인증번호 확인
	 * @param map(email, authKey)
	 * @return
	 * @author JWJ
	 */
	int checkAuthKey(Map<String, String> map);

}

package com.jobbuilder.project.email.model.service;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import com.jobbuilder.project.email.model.mapper.EmailMapper;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
@Slf4j
public class EmailServiceImpl implements EmailService{

	private final EmailMapper mapper;	
	private final JavaMailSender mailSender;	
	private final SpringTemplateEngine templateEngine;
	
	
	@Override
	public String sendEmail(String htmlName, String email){
		
		// 1. 인증키 생성 및 DB 저장 준비
		String authKey = createAuthKey();
		
		Map<String, String> map = new HashMap<>();
		map.put("authKey", authKey);
		map.put("email", email);
		
		storeAuthKey(map);
		if(!storeAuthKey(map))	return null;
		
		
		MimeMessage mimeMessage = mailSender.createMimeMessage();
	
		try {
			MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
			
			
			// 메일 기본 정보 설정
			helper.setTo(email); // 받는 사람 ( 수신자 ) 
			helper.setSubject(" [jobBuilder] 회원 가입 인증번호 입니다. "); // 제목
			helper.setText(loadHtml(authKey, htmlName), true ); // HTML 내용 설정 -> 마지막에 true안하면 false되서 텍스트값출력
			helper.addInline("logo", new ClassPathResource("static/images/logo.png"));
			
			// 실제 메일 발송
			mailSender.send(mimeMessage);
			
			return authKey; // 모든 작업 성공 시 인증키 반환
			
			
		} catch (MessagingException e) {
			
			e.printStackTrace();
			return null; // 메일 발송 실패
		}
		
	}
	// 인증번호 확인
	@Override
	public int checkAuthKey(Map<String, String> map) {		
		return mapper.checkAuthKey(map);
	}
	private String createAuthKey() {		
		return UUID.randomUUID().toString().substring(0, 6);
	}
			
	// 인증키와 이메일을 DB예 저장하는 메서드 
	@Transactional(rollbackFor = Exception.class) // 메서드 레벨에서도 이용 가능
	private boolean storeAuthKey(Map<String, String> map) {
			
		int result = mapper.updateAuthKey(map);
				
		if(result == 0) {
			result = mapper.insertAuthKey(map);		}
			
		return result > 0; // 성공 여부 반환 ( true / false ) 
		}
	
	// HTML 템플릿에 데이터를 바인딩하여 최종 HTML 생성
	private String loadHtml(String authKey, String htmlName) {
		
		Context context = new Context (); 
		context.setVariable("authKey", authKey);
		
		
		return templateEngine.process("email/" + htmlName, context);
	}
}

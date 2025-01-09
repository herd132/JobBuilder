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

import com.jobbuilder.project.email.model.mapper.WookjaeEmailMapper;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
@Slf4j
public class WookjaeEmailSerivceImpl implements WookjaeEmailService{
	
	/* ********** 필드 ********** */
	private final WookjaeEmailMapper mapper;
	private final JavaMailSender mailSender;
	private final SpringTemplateEngine templateEngine;
	
	/* ********** 메서드 ********** */
	@Override	// AUTH_KEY 에 이메일, 인증키 수정 또는 생성
	public String sendEmail(String htmlName, String email) {
		
		String authKey = createAuthKey();
		
		Map<String, String> map = new HashMap<>();
		map.put("authKey", authKey);
		map.put("email", email);
		
		if(!storeAuthKey(map)) return null;
		
		MimeMessage mimeMessage = mailSender.createMimeMessage();
		
		try {
			
			MimeMessageHelper helper =  new MimeMessageHelper(mimeMessage, true, "UTF-8");
			
			helper.setTo(email);
			helper.setSubject("[jobBuilder] 인증번호 입니다");
			helper.setText(loadHtml(authKey, htmlName), true);
			helper.addInline("logo", new ClassPathResource("static/images/logo.png"));
			
			mailSender.send(mimeMessage);
			
			return authKey;
			
		} catch (MessagingException e) {
			e.printStackTrace();
			return null;
		}
	}
	
	@Override	// 인증번호 확인
	public int checkAuthKey(Map<String, String> map) {
		return mapper.checkAuthKey(map);
	}

	// sendEmail(String htmlName, String email) 내부 메서드
	private String createAuthKey() {
		return UUID.randomUUID().toString().substring(0, 6);
	}
	
	// sendEmail(String htmlName, String email) 내부 메서드
	private boolean storeAuthKey(Map<String, String> map) {
		
		int result = mapper.updateAuthKey(map);
		if(result == 0) result = mapper.insertAuthKey(map);
		
		return result > 0;
	}
	
	// sendEmail(String htmlName, String email) 내부 메서드
	private String loadHtml(String authKey, String htmlName) {
		
		// import 시 주의!!! org.thymeleaf.context.Context;
		Context context = new Context();
		context.setVariable("authKey", authKey);
		
		return templateEngine.process("email/" + htmlName, context);
	}

}

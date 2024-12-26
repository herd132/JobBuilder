package com.jobbuilder.project.counsel.model.service;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.jobbuilder.project.chatting.model.mapper.ChattingMapper;
import com.jobbuilder.project.counsel.model.dto.Counselor;
import com.jobbuilder.project.counsel.model.mapper.CounselMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class CounselServiceImpl implements CounselService {
	
	private final CounselMapper mapper;
	private final ChattingMapper chattingMapper;

	private final BCryptPasswordEncoder bcrypt;
	
	@Override
	public Counselor loginCounselor(Counselor inputCounselor) {
		
		Counselor loginCounseolr = mapper.loginCounselor(inputCounselor);
		
		if(loginCounseolr == null) return null;
		
		// 입력 받은 비밀번호 평문과 암호화된 비밀번호가 일치하는지 확인
		if(!bcrypt.matches(inputCounselor.getMemberPw(), loginCounseolr.getMemberPw())) {
			return null;
		}
		
		loginCounseolr.setMemberPw(null);
		
		return loginCounseolr;
	}
}

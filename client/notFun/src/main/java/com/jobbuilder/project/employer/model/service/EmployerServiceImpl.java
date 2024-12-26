package com.jobbuilder.project.employer.model.service;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.jobbuilder.project.employer.model.dto.Employer;
import com.jobbuilder.project.employer.model.mapper.EmployerMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
@Slf4j
public class EmployerServiceImpl implements EmployerService {

	private final EmployerMapper mapper;
	private final BCryptPasswordEncoder bcrypt;
	
	/* ********** 로그인 관련 ********** */
	@Override	// 고용주 로그인
	public Employer login(Employer inputEmployer) {
		
		Employer loginEmployer = mapper.login(inputEmployer.getMemberEmail());
		
		if(loginEmployer == null) return null;
		if(!bcrypt.matches(inputEmployer.getMemberPw(), loginEmployer.getMemberPw())) return null;
		
		loginEmployer.setMemberPw(null);
		
		return loginEmployer;
	}
	
	/* ********** 회원가입 관련 ********** */
	@Override	// 이메일 중복검사(비동기)
	public int checkEmail(String memberEmail) {
		return mapper.checkEmail(memberEmail);
	}
	
	@Override	// 고용주 회원가입
	public int signUp(Employer inputEmployer, String[] businessAddress) {
		
		if(!inputEmployer.getBusinessAddress().equals(",,")) {
			String address = String.join("^^^", businessAddress);
			inputEmployer.setBusinessAddress(address);
		} else {
			inputEmployer.setBusinessAddress(null);
		}
		
		String encPw = bcrypt.encode(inputEmployer.getMemberPw());
		inputEmployer.setMemberPw(encPw);
		
		int result = mapper.signUpMember(inputEmployer);
				
		if(result == 0) return 0;
		
		result = mapper.signUpEmplyoer(inputEmployer);
		
		return 0;
	}
}

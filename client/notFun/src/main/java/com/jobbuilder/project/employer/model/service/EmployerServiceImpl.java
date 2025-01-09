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
	
	@Override	// 전화번호 중복검사(비동기) 
	public int checkTel(String employerTel) {
		return mapper.checkTel(employerTel);
	}
	
	@Override	// 고용주 회원가입
	public int signUp(Employer inputEmployer, String[] businessAddress, String optionalAgree) {
				
		// 선택약관 동의여부 처리
		if(optionalAgree != null) inputEmployer.setOptionalAgreeFl("Y");
		else inputEmployer.setOptionalAgreeFl("N");
		
		// 사업장주소 처리(필수입력 사항)
		String address = String.join("^^^", businessAddress);
		inputEmployer.setBusinessAddress(address);
		
		// 비밀번호 암호화(필수입력 사항)
		String encPw = bcrypt.encode(inputEmployer.getMemberPw());
		inputEmployer.setMemberPw(encPw);
		
		// businessRegistrationNumber 재가공(1234567890 -> 123-45-67890)
		String brNo = inputEmployer.getBusinessRegistrationNumber().substring(0, 3) + "-" +
						inputEmployer.getBusinessRegistrationNumber().substring(3, 5) + "-" +
						inputEmployer.getBusinessRegistrationNumber().substring(5);
		inputEmployer.setBusinessRegistrationNumber(brNo);
		
		log.debug("inputEmployer : " + inputEmployer);
		/* inputEmployer : Employer(employerNo=0, businessRegistrationNumber=312-31-797, 
		 * businessName=샘플회사명, 
		 * businessAddress=08386^^^서울 구로구 구로동로 2^^^샘플 사업장 세부주소, 
		 * membershipLevel=null, optionalAgreeFl=N, memberNo=0, memberEmail=test123@awe.com, 
		 * memberPw=$2a$10$MV6JQb6h3R0rGHykL4cI8usUBVky5H7Tt1moi8TdhEzr.0h1DLI6S, 
		 * memberName=김용유, memberTel=01078941234, enrollDate=null, memberDelFl=null, authority=0, 
		 * businessWorktypeList=null, businessImgList=null)
		 * */
		
		// MEMBER TABLE 에 삽입
		int result = mapper.signUpMember(inputEmployer);
		if(result == 0) return 0;
		
		int memberNo = mapper.selectEmpNo(inputEmployer.getMemberEmail());
		if(memberNo == 0) return 0;
		
		inputEmployer.setMemberNo(memberNo);
		
		// EMPLOYER TABLE 에 삽입
		result = mapper.signUpEmployer(inputEmployer);
		
		return result;
	}
}

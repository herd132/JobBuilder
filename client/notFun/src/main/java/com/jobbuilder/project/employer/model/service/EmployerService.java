package com.jobbuilder.project.employer.model.service;

import java.util.Map;

import com.jobbuilder.project.employer.model.dto.Employer;

public interface EmployerService {

	
	/* ********** 로그인 관련 ********** */
	/** 고용주 로그인
	 * @param inputEmployer(memberEmail, memberPw)
	 * @return
	 * @author JWJ
	 */
	Employer login(Employer inputEmployer);
	
	/* ********** 고용주 이메일/비밀번호 찾기 ********** */
	
	/** 고용주 이메일 찾기(사업자 번호로)
	 * @param map(memberName, businessRegistrationNumber)
	 * @return
	 */
	String findEmailByBusinessRegistrationNumber(Map<String, Object> map);
	
	/** 고용주 이메일 찾기(전화번호로)
	 * @param map(memberName, memberTel)
	 * @return
	 */
	String findEmailByPhoneNumber(Map<String, Object> map);

	/* ********** 고용주 회원가입 관련 ********** */
	
	/** 이메일 중복검사(비동기)
	 * @param memberEmail
	 * @return
	 * @author JWJ
	 */
	int checkEmail(String memberEmail);
	
	/** 전화번호 중복검사(비동기) 
	 * @param employerTel
	 * @return
	 */
	int checkTel(String employerTel);
	
	/** 회원가입
	 * @param inputEmployer(memberEmail, memberPw, memberName, memberTel,
	 * 						businessRegistrationNumber, businessName)
	 * @param businessAddress(우편번호, 도로명/지번주소, 상세주소)
	 * @param optionalAgree
	 * @return
	 * @author JWJ
	 */
	int signUp(Employer inputEmployer, String[] businessAddress, String optionalAgree);







}

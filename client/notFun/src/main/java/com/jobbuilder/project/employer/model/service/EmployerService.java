package com.jobbuilder.project.employer.model.service;

import com.jobbuilder.project.employer.model.dto.Employer;

public interface EmployerService {

	/** 고용주 로그인
	 * @param inputEmployer(memberEmail, memberPw)
	 * @return
	 */
	Employer login(Employer inputEmployer);

	/* ********** 고용주 회원가입 관련 ********** */
	
	/** 회원가입
	 * @param inputEmployer(memberEmail, memberPw, memberName, memberTel,
	 * 						businessRegistrationNumber, businessName, optionalAgreeFl)
	 * @param businessAddress(우편번호, 도로명/지번주소, 상세주소)
	 * @return
	 * @author JWJ
	 */
	int signUp(Employer inputEmployer, String[] businessAddress);



}

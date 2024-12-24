package com.jobbuilder.project.employer.model.mapper;

import org.apache.ibatis.annotations.Mapper;

import com.jobbuilder.project.employer.model.dto.Employer;

@Mapper
public interface EmployerMapper {

	/* ********** 로그인 ********** */
	Employer login(String memberEmail);		// email 일치한 employer 얻어오기


	/* ********** 회원가입 ********** */
	
	/** 고용주 회원가입 (EMPLOYER TABLE)
	 * @param inputEmployer(memberEmail, memberPw, memberName, memberTel, businessAddress
	 * 						businessRegistrationNumber, businessName, optionalAgreeFl)
	 * @param businessAddress(우편번호, 도로명/지번주소, 상세주소)
	 * @return
	 * @author JWJ
	 */
	int signUpMember(Employer inputEmployer);
	
	/** 고용주 회원가입 (MEMBER TABLE 먼저)
	 * @param inputEmployer(memberEmail, memberPw, memberName, memberTel, businessAddress
	 * 						businessRegistrationNumber, businessName, optionalAgreeFl)
	 * @param businessAddress(우편번호, 도로명/지번주소, 상세주소)
	 * @return
	 * @author JWJ
	 */
	int signUpEmplyoer(Employer inputEmployer);
}

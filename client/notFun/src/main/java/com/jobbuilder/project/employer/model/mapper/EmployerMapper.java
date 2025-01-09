package com.jobbuilder.project.employer.model.mapper;

import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import com.jobbuilder.project.employer.model.dto.Employer;

@Mapper
public interface EmployerMapper {

	/* ********** 로그인 ********** */
	Employer login(String memberEmail);		// email 일치한 employer 얻어오기
	
	
	
	
	/* ********** 고용주 이메일/비밀번호 찾기 ********** */
	/** 고용주 이메일 찾기(사업자 번호로)
	 * @param map (memberName, businessRegistrationNumber)
	 * @return
	 */
	String findEmailByBusinessRegistrationNumber(Map<String, Object> map);
	
	/** 고용주 이메일 찾기(전화번호로)
	 * @param map(memberName, memberTel)
	 * @return
	 */
	String findEmailByPhoneNumber(Map<String, Object> map);
	
	/** 고용주가 가입한 (이름, 이메일) 조회
	 * @param map (memberName, memberEmail)
	 * @return
	 */
	String checkNameEmail(Map<String, Object> map);
	
	/** 고용주 비밀번호 새로 설정
	 * @param map (memberEmail, encPw)
	 * @return
	 */
	int changePw(Map<String, String> map);


	/* ********** 회원가입 ********** */
	int checkEmail(String memberEmail);		// 이메일 중복검사(비동기)
	int checkTel(String employerTel);		// 전화번호 중복검사(비동기) 
	

	/** 고용주 회원가입 (MEMBER TABLE)
	 * @param inputEmployer(memberEmail, memberPw, memberName, memberTel)
	 * @param businessAddress(우편번호, 도로명/지번주소, 상세주소)
	 * @return
	 * @author JWJ
	 */
	int signUpMember(Employer inputEmployer);
	
	int selectEmpNo(String memberEmail);		// 방금 insert 한 고용주의 memberNo 얻어오기 

	/** 고용주 회원가입 (EMPLOYER TABLE)
	 * @param inputEmployer(memberNo, businessAddress
	 * 						businessRegistrationNumber, businessName, optionalAgreeFl)
	 * @param businessAddress(우편번호, 도로명/지번주소, 상세주소)
	 * @return
	 * @author JWJ
	 */
	int signUpEmployer(Employer inputEmployer);


}

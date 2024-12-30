package com.jobbuilder.project.employer.model.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Employer {
	
	/* ***** EMPLOYER TABLE ***** */
	private int employerNo;						// 고용주 번호(PK)
	private String businessRegistrationNumber;	// 사업자 등록번호
	private String businessName;				// 사업장 이름
	private String businessAddress;				// 사업장 주소
	private String optionalAgreeFl;				// 선택약관 동의여부(기본값 Y)
	private String businessNickname;			// 사업장 별칭(기본값 본점)
	private String businessTel;					// 사업장 전화번호
	
	private String membershipLevel;				// 멤버십 등급
	private String membershipName;				// 멤버십 이름
	
	/* ***** MEMBER TABLE ***** */
	private int memberNo;						// 회원 번호(PK)
	private String memberEmail;					// 회원 이메일(고용주 로그인용)
	private String memberPw;					// 회원 비밀번호
	private String memberName;					// 회원 이름
	private String memberTel;					// 회원 전화번호
	private String enrollDate;					// 회원 가입일
	private String memberDelFl;					// 회원 탈퇴여부(Y/N)
	
	private int authorityNo;					// 회원 권한(고용주 : 1)
	private String authorityName;				// 회원 종류
	
	/* ***** BUSINESS_WORKTYPE TABLE (사업장 업직종 해소용) ***** */
	private List<BusinessWorktype> businessWorktypeList;
	private String businessWorktype;
	
	/* ***** 사업장 이미지 있는 경우 ***** */
	private List<BusinessImg> businessImgList;	// 사업장 이미지 리스트(최대 5개)
}

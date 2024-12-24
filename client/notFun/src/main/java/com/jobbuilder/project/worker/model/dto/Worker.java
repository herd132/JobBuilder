package com.jobbuilder.project.worker.model.dto;

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
public class Worker {
	private int memberNo;		    // 회원번호
	private String memberEmail;		// 회원이메일
	private String memberPw;		// 회원 비밀번호
	private String memberName;		// 회원 이름
	private int memberTel;			// 회원 전화번호 (비밀번호 찾기용)
	private String enrollDate;		// 회원 탈퇴여부
	private int authority;			// 권한
	
	// 알바생 기본정보 ( Join ) 
	private int workerNo;			// 알바생번호
	private String workerId;		// 알바생 아이디 ( 로그인용 )
	private String workerNickname;	// 알바생 닉네임 ( 게시글용 )
	private String workerAddress;	// 알바생 주소
	private String profileImg;		// 알바생 프로필 이미지 ( 마이페이지 )
	private int signUpPath;			// 알바생 가입 경로 ( 1 - 6 )
	private String fastLoginToken;	// 빠른 로그인 ( 카카오톡 등 )
	private String blindLoginId;	// 블라인드 게시판 이용할 경우
	private String workerMbti;		// 알바생 MBTI
	private String workerBrithDate; // 알바생 생년월일
	

	
	
	
}
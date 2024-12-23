package com.jobbuilder.project.worker.model.service;

import com.jobbuilder.project.worker.model.dto.Member;
import com.jobbuilder.project.worker.model.dto.Worker;

public interface WorkerService {

	// 근로자 로그인
	Member login(Member inputMember);
	
	/* *************** 회원가입 *************** */
	// 이메일 중복검사
	int checkEmail(String memberEmail);
	// 닉네임 중복검사
	int checkNickname(String workerNickname);
	// 아이디 중복검사
	int checkId(String workerId);
	// 회원가입
	int signup(Worker workerMember, String[] memberAddress);

}

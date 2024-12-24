package com.jobbuilder.project.worker.model.mapper;

import org.apache.ibatis.annotations.Mapper;

import com.jobbuilder.project.worker.model.dto.Member;
import com.jobbuilder.project.worker.model.dto.Worker;

@Mapper
public interface WorkerMapper {

	// 근로자 로그인 서비스
	Worker login(String workerId);

	/* **************** 회원가입 ******************* */
	
	int checkEmail(String memberEmail); 		// 근로자 이메일 중복확인
	int checkNickname(String workerNickname);	// 근로자 닉네임 중복확인
	int signupMember(Worker inputMember);		// 근로자 회원가입
	int checkId(String workerId);				// 근로자 아이디 중복확인
	int signup(Worker inputMember);				// 회원가입
	int signupWorker(Worker inputMember);		// 회원가입 ( 근로자 정보 저장 ) 

}

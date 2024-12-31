package com.jobbuilder.project.worker.model.mapper;

import java.util.Map;

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
	int checkId(String workerId);				// 근로자 아이디 중복확인
	int signupMember(Worker inputMember);		// 근로자 회원가입	
	int signupWorker(Worker inputMember);		// 회원가입 ( 근로자 정보 저장 ) 

	
	// 회원 찾기 기능 
	// 이메일을 이용해 회원찾기
	Worker workerFindEmail(Worker inputWorker);
	// 비밀번호 찾기
	Worker workerFindPw(Worker inputWorker);
	// 비밀번호 찾기후 비밀번호 변경
	int findChangePw(Map<String, Object> map);	
	// 전화번호 중복검사
	int checkTel(String workerTel);

}

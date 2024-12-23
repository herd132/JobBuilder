package com.jobbuilder.project.worker.model.service;

import java.util.HashMap;
import java.util.Map;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.jobbuilder.project.worker.model.dto.Worker;
import com.jobbuilder.project.worker.model.mapper.WorkerMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
@Slf4j
public class WorkerServiceImpl implements WorkerService{

	private final WorkerMapper mapper;
	
	private final BCryptPasswordEncoder bcrypt;

	// 회원 로그인
	@Override
	public Worker login(Worker inputMember) {
		
		// 암호화 진행
		String bcryptPassword = bcrypt.encode(inputMember.getMemberPw());
		
		// 1. 이메일이 일치하면서 탈퇴하지 않은 회원 조회
		Worker loginMember = mapper.login(inputMember.getMemberEmail());
		
		// 일치하는 이메일이 없어서 조회 결과가 null인경우
		if(loginMember == null) return null;
		
		// 입력 받은 비밀번호 평문과 암호화된 비밀번호가 일치하는지 확인
		if(!bcrypt.matches(inputMember.getMemberPw(), loginMember.getMemberPw())) {
			return null;
		}
		
		loginMember.setMemberPw(null);
		
		return loginMember;
	}
	
	@Override
	public int checkId(String workerId) {
		
		return mapper.checkId(workerId);
	}
	
	// 회원 이메일 중복검사
	@Override
	public int checkEmail(String memberEmail) {
		
		return mapper.checkEmail(memberEmail);
	}
	
	// 회원 닉네임 중복검사
	@Override
	public int checkNickname(String workerNickname) {
		
		return mapper.checkNickname(workerNickname);
	}

	// 회원 가입
	@Override
	public int signup(Worker inputMember, String[] memberAddress) {
		if(!inputMember.getWorkerAddress().equals(",,")) {
			
			// String.join("구분자" , 배열 ) 		
			
			String address = String.join("^^^", memberAddress);
			
			// 구분자로 "^^^" 쓴 이유 :
			// -> 주소, 상세주소에 없는 특수문자 작성
			// -> 나중에 마이페이지에서 주소 수정 시 다시 3분할 해야할 때 구분자로 이용할 예정
			// inputMember 주소로 합쳐진 주소를 세팅
			inputMember.setWorkerAddress(address);
			
		} else {			
		// 주소가 입력되지 않은 경우
			inputMember.setWorkerAddress(null); // null 저장	
		}
		
		// inputMember 안의 memberPw -> 평문	
		// 비밀번호를 암호화하여 inputMember에 세팅
		String encPw = bcrypt.encode(inputMember.getMemberPw()); // 암호화하는과정
		inputMember.setMemberPw(encPw);
		// 회원 가입 매퍼 메서드 호출쓰
		Map<Object, Object> signupList = new HashMap<>();
		
		int result = mapper.signupMember(inputMember);
		
		// 회원가입 성공시 DB에 정보 알바생 기본 정보 입력
		if(result > 0 ) {
			int resultWorker = mapper.signupWorker();

			signupList.put("resultWorker", resultWorker);
		}		
		signupList.put("signupMember", result);
		
		return result;
	}
}

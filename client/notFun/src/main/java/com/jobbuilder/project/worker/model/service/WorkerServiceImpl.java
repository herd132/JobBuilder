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

@Transactional(rollbackFor = Exception.class)
@Service
@RequiredArgsConstructor
@Slf4j
public class WorkerServiceImpl implements WorkerService{

	private final WorkerMapper mapper;
	
	private final BCryptPasswordEncoder bcrypt;

	// 회원 로그인
	@Override
	public Worker login(Worker inputWorker) {
		
		
		// 1. ID 가 일치하면서 탈퇴하지 않은 회원 조회
		Worker loginWorker = mapper.login(inputWorker.getWorkerId());
		if(loginWorker == null) return null;
		
		
		// 입력 받은 비밀번호 평문과 암호화된 비밀번호가 일치하는지 확인
		if(!bcrypt.matches(inputWorker.getMemberPw(), loginWorker.getMemberPw())) {
			
			return null;
		}
		
		loginWorker.setMemberPw(null);
		
		return loginWorker;
	}
	
	// 아이디 중복검사
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
	public int signup(Worker inputWorker, String[] memberAddress) {
		if(!inputWorker.getWorkerAddress().equals(",,")) {
			
				
			
			String address = String.join("^^^", memberAddress);
			
			// 구분자로 "^^^" 쓴 이유 :
			// -> 주소, 상세주소에 없는 특수문자 작성
			// -> 나중에 마이페이지에서 주소 수정 시 다시 3분할 해야할 때 구분자로 이용할 예정
			// inputMember 주소로 합쳐진 주소를 세팅
			inputWorker.setWorkerAddress(address);
			
		} else {			
		// 주소가 입력되지 않은 경우
			inputWorker.setWorkerAddress(null); // null 저장	
		}
		
		// inputMember 안의 memberPw -> 평문	
		// 비밀번호를 암호화하여 inputMember에 세팅
		String encPw = bcrypt.encode(inputWorker.getMemberPw()); // 암호화하는과정
		inputWorker.setMemberPw(encPw);
		// 회원 가입 매퍼 메서드 호출쓰
		
		int result = mapper.signupMember(inputWorker);
		
		// 회원가입 성공시 DB에 정보 알바생 기본 정보 입력
		if(result > 0 ) {
			int resultWorker = mapper.signupWorker(inputWorker);

		}	else {
			return 0;
		}
		
		
		return result;
	}
	
	// 이메일로 아이디 찾기
	@Override
	public Worker workerFindEmail(Worker inputWorker) {
		
		return mapper.workerFindEmail(inputWorker);
	}
	
	// 비밀번호 찾기
	@Override
	public Worker workerFindPw(Worker inputWorker) {
		// TODO Auto-generated method stub
		return mapper.workerFindPw(inputWorker);
	}
	
	// 비밀번호 찾기후 비밀번호 변경
	@Override
	public int findChangePw(int memberNo, String newPw) {
		String encPw = bcrypt.encode(newPw);			// 새 비밀번호는 필드값이 없기 때문에 map을 활용
		Map<String, Object> map = new HashMap<>(); 
		map.put("memberNo", memberNo);
		map.put("encPw", encPw);
		return mapper.findChangePw(map);
	}
	
	// 비밀번호 찾기시 전화번호 중복검사
	@Override
	public int checkMemberTel2(Worker inputWorker) {
		return mapper.checkMemberTel2(inputWorker);
	}
	
}

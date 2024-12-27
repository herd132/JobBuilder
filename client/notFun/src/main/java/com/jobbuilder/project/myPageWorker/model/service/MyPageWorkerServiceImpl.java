package com.jobbuilder.project.myPageWorker.model.service;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.jobbuilder.project.myPageWorker.model.mapper.MyPageWorkerMapper;
import com.jobbuilder.project.worker.model.dto.Worker;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
@Slf4j
public class MyPageWorkerServiceImpl implements MyPageWorkerService{

	private final MyPageWorkerMapper mapper;
	private final BCryptPasswordEncoder bcrypt;

	/** 
	 *	닉네임 중복검사
	 */
	@Override
	public int checkNickname(String workerNickname) {
		return mapper.checkNickname(workerNickname);
	}

	/**
	 * 연락처 중복검사
	 */
	@Override
	public int checkMemberTel(String memberTel) {
		return mapper.checkMemberTel(memberTel);
	}

	/**
	 * 비밀번호 확인
	 */
	@Override
	public int checkPw(String currentPassword, Worker loginWorker) {
		String originPw = mapper.checkPwSet(loginWorker.getMemberNo());
		if(!bcrypt.matches(currentPassword, originPw)) {
			return 0;
		}
		
		return 1;
	}
}

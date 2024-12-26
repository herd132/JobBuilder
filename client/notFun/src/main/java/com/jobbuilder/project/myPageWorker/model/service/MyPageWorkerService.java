package com.jobbuilder.project.myPageWorker.model.service;

import com.jobbuilder.project.worker.model.dto.Worker;

public interface MyPageWorkerService {

	/** 닉네임 중복검사
	 * @param workerNickname
	 * @return
	 */
	int checkNickname(String workerNickname);

	/** 연락처 중복검사
	 * @param memberTel
	 * @return
	 */
	int checkMemberTel(String memberTel);

	/** 비밀번호 확인
	 * @param currentPw
	 * @return
	 */
	int checkPw(String currentPassword, Worker loginWorker);

}

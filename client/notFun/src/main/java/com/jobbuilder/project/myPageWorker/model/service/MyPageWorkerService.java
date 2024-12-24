package com.jobbuilder.project.myPageWorker.model.service;

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

}

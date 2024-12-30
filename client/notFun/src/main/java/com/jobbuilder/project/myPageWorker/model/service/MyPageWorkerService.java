package com.jobbuilder.project.myPageWorker.model.service;

import org.springframework.web.multipart.MultipartFile;

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

	/** 비밀번호 변경
	 * @param memberNo
	 * @param workerPw
	 * @return
	 */
	int workerChangePw(int memberNo, String workerPw);

	/** 정보변경
	 * @param loginWorker
	 * @param workerAddress
	 * @return
	 */
	int updateInfo(Worker loginWorker, String[] workerAddress);


}

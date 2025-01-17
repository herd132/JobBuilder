package com.jobbuilder.project.myPageWorker.model.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.jobbuilder.project.board.model.dto.Board;
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

	/** 회원탈퇴
	 * @param loginWorker
	 * @return
	 */
	int secession(Worker loginWorker);
	int secessionResume(Worker loginWorker);
	
	/** 업데이트
	 * @param loginWorker
	 * @param imageInput
	 * @param workerAddress
	 * @return 
	 */
	int updateInfo(Worker loginWorker, MultipartFile imageInput,String[] workerAddress, int status) throws Exception;

	/** 작성 글 제목 불러오기
	 * @param memberNo
	 * @return
	 */
	List<Board> writeView(int memberNo, int cp);

	



}

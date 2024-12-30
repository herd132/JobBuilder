package com.jobbuilder.project.myPageWorker.model.mapper;

import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import com.jobbuilder.project.worker.model.dto.Worker;

@Mapper
public interface MyPageWorkerMapper {

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

	/** 현재 비밀번호 확인
	 * @param memberNo
	 * @return
	 */
	String checkPwSet(int memberNo);

	/** 비밀번호 변경
	 * @param paramMap
	 * @return
	 */
	int workerChangePw(Map<String, Object> paramMap);


	

}

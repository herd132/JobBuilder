package com.jobbuilder.project.myPageWorker.model.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.session.RowBounds;

import com.jobbuilder.project.board.model.dto.Board;
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

	/** 회원탈퇴
	 * @param loginWorker
	 * @return
	 */
	int secession(Worker loginWorker);

	/**  업데이트
	 * @param loginWorker
	 * @return
	 */
	int updateInfoWorker(Worker loginWorker);
	
	int updateInfoMember(Worker loginWOrker);


	/** 작성 글 제목 불러오기
	 * @param memberNo
	 * @return
	 */
	List<Board> writeView(int memberNo, RowBounds rowBounds);



	

}

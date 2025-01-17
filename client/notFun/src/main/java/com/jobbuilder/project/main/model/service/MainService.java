package com.jobbuilder.project.main.model.service;

import java.util.List;
import java.util.Map;

import com.jobbuilder.project.board.model.dto.Board;
import com.jobbuilder.project.main.model.dto.Brand;
import com.jobbuilder.project.serviceCenter.model.dto.ServiceCenter;

public interface MainService {

	/** 메인페이지 Top10 공고(로고)출력 (누적결제금액 많은순)
	 * @return
	 */
	List<Brand> selectTopBrand();

	/** 타입별 멤버십 공고 조회
	 * @return
	 */
	List<Brand> selectMembershipList(int type);

	/** 가장 최근 공고 10개 조회
	 * @return
	 */
	List<Brand> selectRecentRecruitments();

	/** 최근 공지사항 3개 조회
	 * @return
	 */
	List<ServiceCenter> selectRecentNotice();

	/** 최신 알바게시글 3개 조회
	 * @return
	 */
	List<Board> selectRecentBoard();

	/** 곧 마감되는 알바 조회
	 * @return
	 */
	List<Map<String, Object>> selectUpcomingDeadlineJobs();

}

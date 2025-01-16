package com.jobbuilder.project.main.model.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import com.jobbuilder.project.board.model.dto.Board;
import com.jobbuilder.project.main.model.dto.Brand;
import com.jobbuilder.project.serviceCenter.model.dto.ServiceCenter;

@Mapper
public interface MainMapper {

	/** 메인페이지 Top10 공고(로고)출력 (누적결제금액 많은순)
	 * @return
	 */
	List<Brand> selectTopBrand();

	/** 플래티넘 공고 조회
	 * @return
	 */
	List<Brand> selectMembershipList(int type);

	/** 가장 최근 공고 10개 조회
	 * @return
	 */
	List<Brand> selectRecentRecruitments();

	/** 최신 공지사항 3개 조회
	 * @return
	 */
	List<ServiceCenter> selectRecentNotice();

	/** 최신 알바게시글 3개 조회
	 * @return
	 */
	List<Board> selectRecentBoard();

}

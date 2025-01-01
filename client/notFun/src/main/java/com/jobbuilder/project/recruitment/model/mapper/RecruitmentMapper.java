package com.jobbuilder.project.recruitment.model.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.session.RowBounds;

import com.jobbuilder.project.employer.model.dto.Employer;
import com.jobbuilder.project.recruitment.model.dto.Recruitment;

@Mapper
public interface RecruitmentMapper {
	
	/* ********** 공고 추가 페이지 이동 관련 ********** */
	/** 사업장 정보 얻어오기
	 * @param memberNo
	 * @return
	 * @author JWJ
	 */
	List<Employer> selectBusinessList(int memberNo);

	/** 선호조건 리스트 불러오기
	 * @return
	 * @author JWJ
	 */
	List<Map<String, String>> selectPreferredList();

	/** 복리후생 대분류 불러오기
	 * @return
	 * @author JWJ
	 */
	List<Map<String, String>> selectSupportTitleList();

	/** 복리후생 소분류 불러오기
	 * @param supportNo
	 * @return
	 * @author JWJ
	 */
	List<Map<String, String>> selectSubSupportList(String supportNo);
	
	/* ********** 공고 추가(post) 관련 ********** */

	/** 공고 추가
	 * @param addRecruitment(recruitmentTitle, recruitmentContent, recruitmentDeadline, jobtypeNo, 
	 * 		numOfRecruitmentName, salaryNo, gradeNo, periodNo, daysNo, timeNo, employerNo, salaryMount)
	 * @return recruitmentNo
	 */
	int insertRecruitment(Recruitment addRecruitment);

	/** 선택된 선호조건의 preferredNo 얻어 오기
	 * @param preferredCategory
	 * @return
	 */
	String selectPreferredNo(String preferredCategory);

	/** M:N 관계 해소(RECRUITMENT_PREFERRED)
	 * @param recruitmentPreferredNoMap(recruitmentNo, preferredNo)
	 * @return
	 */
	int insertRecruitmentPreferred(Map<String, Object> recruitmentPreferredNoMap);

	/** 선택된 복리후생 조건의 supportNo 얻어 오기
	 * @param supportCategory
	 * @return
	 */
	String selectSupportNo(String supportCategory);

	/** M:N 관계 해소(RECRUITMENT_SUPPORT)
	 * @param recruitmentSupportNoMap(recruitmentNo, supportNo)
	 * @return
	 */
	int insertRecruitmentSupport(Map<String, Object> recruitmentSupportNoMap);

		
	/* ********** 공고글 목록 조회 관련 ********** */
	
	/** 전체 공고글 수 조회
	 * @return
	 */
	int getListCount();

	/** 전체 공고글 목록 조회
	 * @param rowBounds
	 * @return
	 */
	List<Recruitment> selectRecruitmentList(RowBounds rowBounds);

}

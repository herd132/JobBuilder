package com.jobbuilder.project.recruitment.model.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.session.RowBounds;

import com.jobbuilder.project.employer.model.dto.BusinessWorktype;
import com.jobbuilder.project.employer.model.dto.Employer;
import com.jobbuilder.project.recruitment.model.dto.Recruitment;
import com.jobbuilder.project.recruitment.model.dto.RecruitmentPreferred;
import com.jobbuilder.project.recruitment.model.dto.RecruitmentSupport;

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
	
	/** 공고 대표이미지 추가
	 * @param map(recruitmentNo, recruitmentProfile)
	 * @return
	 */
	int updateRecruitmentImg(Map<String, Object> map);

		
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
	
	/** 검색문이 포함된 공고글 수 조회
	 * @param query
	 * @return
	 */
	int getSearchCount(String query);

	/** 검색문이 포함된 공고글 목록 조회
	 * @param query
	 * @param rowBounds
	 * @return
	 */
	List<Recruitment> selectSearchRecruitmentList(String query, RowBounds rowBounds);
	
	
	/* ********** 공고 상세 페이지 이동 관련 ********** */
	
	/** 공고글 상세 조회
	 * @param recruitmentNo
	 * @return
	 */
	Recruitment selectOne(int recruitmentNo);
	
	/** 업직종 조회 (공고글 상세 조회 관련)
	 * @param employerNo
	 * @return
	 */
	List<BusinessWorktype> getBWList(int employerNo);

	/** 우대사항 조회 (공고글 상세 조회 관련)
	 * @param recruitmentNo
	 * @return
	 */
	List<RecruitmentPreferred> getPreferredList(int recruitmentNo);

	/** 복리후생 조회 (공고글 상세 조회 관련)
	 * @param recruitmentNo
	 * @return
	 */
	List<RecruitmentSupport> getSupportList(int recruitmentNo);
	
	
	/* ********** 공고 수정(post) 관련 ********** */

	/** RECRUITMENT 테이블 수정 (recruitmentNo을 물고 들어감)
	 * @param updateRecruitment(recruitmentTitle, recruitmentContent, recruitmentDeadline, jobtypeNo,
	 * 			numOfRecruitmentName, salaryNo, gradeNo, periodNo, daysNo, timeNo, salaryMount)
	 * @return
	 */
	int updateRecruitment(Recruitment updateRecruitment);

	/** 기존 RECRUITMENT_PREFERRED 테이블의 정보 삭제
	 * @param recruitmentNo
	 * @return
	 */
	int deleteRecruitmentPreferred(int recruitmentNo);

	/** 기존 RECRUITMENT_SUPPORT 테이블의 정보 삭제
	 * @param recruitmentNo
	 * @return
	 */
	int deleteRecruitmentSupport(int recruitmentNo);
	
	
	/* ********** 공고 삭제 관련 ********** */

	/** 공고 삭제
	 * @param recruitmentNo
	 * @return
	 */
	int deleteRecruitment(int recruitmentNo);



}

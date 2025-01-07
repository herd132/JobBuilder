package com.jobbuilder.project.recruitment.model.serivce;

import java.util.List;
import java.util.Map;

import org.springframework.web.multipart.MultipartFile;

import com.jobbuilder.project.employer.model.dto.Employer;
import com.jobbuilder.project.recruitment.model.dto.Recruitment;
import com.jobbuilder.project.recruitment.model.dto.ResumeWJ;
import com.jobbuilder.project.resume.model.dto.Resume;

public interface RecruitmentService {

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
	
	/** 주소 대분류 불러오기
	 * @return
	 */
	List<Map<String, String>> selectAddressList();

	/** 복리후생 소분류 불러오기
	 * @param supportNo
	 * @return
	 * @author JWJ
	 */
	List<Map<String, String>> selectSubSupportList(String supportNo);
	
	/** 주소 소분류 불러오기
	 * @param workcondAddressTypeNo
	 * @return
	 */
	List<Map<String, String>> selectSubAddress(String workcondAddressTypeNo);
	

	/* ********** 공고 추가(post) 관련 ********** */
	
	/** 공고 추가
	 * @param addRecruitment(recruitmentTitle, recruitmentContent, recruitmentDeadline, jobtypeNo, 
	 * 		numOfRecruitmentName, salaryNo, gradeNo, periodNo, daysNo, timeNo, employerNo, salaryMount)
	 * @param preferredList
	 * @param supportList
	 * @return recruitmentNo
	 */
	int insertRecruitment(int memberNo, Recruitment addRecruitment, List<String> preferredList,
						List<String> supportList, MultipartFile recruitmentImg) throws Exception;


	/* ********** 공고글 목록 조회 관련 ********** */
	
	/** 공고글 목록 전체 조회
	 * @param cp
	 * @return
	 */
	Map<String, Object> selectRecruitmentList(int cp);
	
	/** 공고글 목록 검색결과 조회
	 * @param query
	 * @param cp
	 * @return
	 */
	Map<String, Object> selectSearchRecruitmentList(String query, int cp);

	
	/* ********** 공고 상세 페이지 이동 관련 ********** */
	
	/** 공고글 상세 조회
	 * @param recruitmentNo
	 * @return
	 */
	Recruitment selectOne(int recruitmentNo);
	
	/** 로그인한 알바생의 이력서 목록 조회
	 * @param workerNo
	 * @return
	 */
	List<ResumeWJ> selectResumeList(int workerNo);
	
	
	/** 한 공고에 동일한 이력서를 제출했는 지 조회
	 * @param recruitmentNo
	 * @param resumeNo
	 * @return
	 */
	int selectRecruitmentResume(int recruitmentNo, int resumeNo);
	
	/** 특정 공고에 이력서 제출
	 * @param recruitmentNo
	 * @param resumeNo
	 * @return
	 */
	int submitResume(int recruitmentNo, int resumeNo);
	
	/* ********** 공고 수정(post) 관련 ********** */

	/** 공고 수정
	 * @param updateRecruitment
	 * @param preferredList
	 * @param supportList
	 * @param businessImage
	 * @return
	 */
	int updateRecruitment(Recruitment updateRecruitment, List<String> preferredList, List<String> supportList,
			MultipartFile recruitmentImg) throws Exception;

	
	/* ********** 공고 삭제 관련 ********** */
	
	/** 공고 삭제
	 * @param recruitmentNo
	 * @return
	 */
	int deleteRecruitment(int recruitmentNo);













}

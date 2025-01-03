package com.jobbuilder.project.myPageEmployer.model.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.session.RowBounds;

import com.jobbuilder.project.employer.model.dto.BusinessImg;
import com.jobbuilder.project.employer.model.dto.BusinessWorktype;
import com.jobbuilder.project.employer.model.dto.Employer;
import com.jobbuilder.project.recruitment.model.dto.Recruitment;
import com.jobbuilder.project.recruitment.model.dto.RecruitmentPreferred;
import com.jobbuilder.project.recruitment.model.dto.RecruitmentSupport;

@Mapper
public interface MyPageEmployerMapper {
	
	/* ********** 내 정보 보기 페이지 관련 ********** */
	
	/** 고용주 1명의 사업장 리스트 얻어오기
	 * @param memberNo
	 * @return employerNo, businessNickname, businessAddress, businessTel
	 * @author JWJ
	 */
	List<Employer> selectBusinessList(int memberNo);
	
	/** 사업장 1개마다 업직종 얻어오기
	 * @param employerNo
	 * @return
	 * @author JWJ
	 */
	List<BusinessWorktype> selectWorktype(int employerNo);

	/** 사업장 1개마다 이미지 얻어오기 (수정해야함)
	 * @param employerNo
	 * @return
	 * @author JWJ
	 */
	List<BusinessImg> selectImage(int employerNo);
	
	/** 사업장 정보 얻어오기
	 * @param employerNo
	 * @return
	 * @author JWJ
	 */
	Employer getBusiness(int employerNo);

	/** 사업장의 업직종 얻어오기
	 * @param empNo
	 * @return
	 * @author JWJ
	 */
	List<BusinessWorktype> getBusinessWorktype(int employerNo);
	
	
	/* ********** 기본정보 수정 페이지 관련 ********** */
	
	
	
	/* ********** 비밀번호 변경 페이지 관련 ********** */
	
	
	
	/* ********** 내가 쓴 공고 페이지 관련 ********** */
	
	/** 내가 쓴 공고 수 조회
	 * @param memberNo
	 * @return
	 */
	int getListCount(int memberNo);
	
	/** 내가 쓴 공고의 지정된 페이지 목록 조회
	 * @param memberNo
	 * @param rowBounds
	 * @return
	 */
	List<Recruitment> selectRecruitmentList(int memberNo, RowBounds rowBounds);
	
	/** 내가 쓴 공고 중 검색 조건에 맞는 공고 수 조회
	 * @param paramMap(key, query, memberNo)
	 * @return
	 */
	int getSearchListCount(Map<String, Object> paramMap);
	
	/** 내가 쓴 공고 중 검색 결과 목록 조회
	 * @param paramMap(key, query, memberNo)
	 * @param rowBounds
	 * @return
	 */
	List<Recruitment> searchRecruitmentList(Map<String, Object> paramMap, RowBounds rowBounds);
	
	/* ********** 내가 쓴 글 페이지 관련 ********** */
	
	
	
	/* ********** 사업장 추가 페이지 관련 ********** */
	
	/** 대분류 리스트 얻어오기
	 * @return
	 * @author JWJ
	 */
	List<Map<String,String>> selectMajorCategory();

	/** workType 가 일치한 소분류 업직종 불러오기
	 * @param workTypeNo
	 * @return
	 * @author JWJ
	 */
	List<Map<String, String>> selectsubCategoryList(String workTypeNo);
	
	/** 사업장 추가(업직종 제외)
	 * @param addBusiness (businessRegistrationNumber, businessName, businessAddress, membershipLevel,
	 * 						memberNo, optionalAgreeFl, businessNickname, businessTel)
	 * @return
	 */
	int addBusiness(Employer addBusiness);
	
	/** 카테고리에 맞는 worktypeNo 얻어오기
	 * @param category
	 * @return
	 */
	String getWorktypeNo(String category);

	/** M:N 해소테이블(BUSINESS_WORKTYPE)에 데이터 삽입
	 * @param map(employerNo, worktypeNo)
	 * @return
	 */
	int addBusinessWorktype(Map<String, Object> map);

	/** 사업장 이미지 추가
	 * @param uploadBusinessImgList
	 * @return
	 */
	int insertUploadList(List<BusinessImg> uploadBusinessImgList);

	
	
	/* ********** 사업장 홍보 페이지 관련 ********** */
	
	
	
	/* ********** 제출된 이력서 보기 페이지 관련 ********** */
	
	
	
	/* ********** 회원 탈퇴 페이지 관련 ********** */
	
	













}

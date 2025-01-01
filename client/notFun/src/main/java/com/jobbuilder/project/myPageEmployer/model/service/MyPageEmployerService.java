package com.jobbuilder.project.myPageEmployer.model.service;

import java.util.List;
import java.util.Map;

import com.jobbuilder.project.employer.model.dto.Employer;

public interface MyPageEmployerService {
	
	/* ********** 내 정보 보기 페이지 관련 ********** */
	
	/** 고용주 1명의 사업장 리스트 얻어오기
	 * @param memberNo
	 * @return employerNo, businessNickname, businessAddress, businessTel,
	 * 			businessWorktypeList, businessImgList
	 * @author JWJ
	 */
	List<Employer> selectBusinessList(int memberNo);
	
	/** 사업장 정보 얻어오기
	 * @param employerNo
	 * @return
	 * @author JWJ
	 */
	Employer getBusiness(int employerNo);
	
	
	/* ********** 기본정보 수정 페이지 관련 ********** */
	
	
	
	/* ********** 비밀번호 변경 페이지 관련 ********** */
	
	

	/* ********** 내가 쓴 공고 페이지 관련 ********** */
	
	/** 내가 쓴 공고 목록 조회
	 * @param memberNo
	 * @param cp
	 * @return
	 */
	Map<String, Object> selectRecruitmentList(int memberNo, int cp);
	
	/** 내가 쓴 공고 목록 중 검색결과 조회
	 * @param paramMap(key, query, memberNo)
	 * @param cp
	 * @return
	 */
	Map<String, Object> searchRecruitmentList(Map<String, Object> paramMap, int cp);
	
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

	/** 사업장 추가
	 * @param loginEmployer(memberNo, businessRegistrationNumber, businessName, membershipLevel, optionalAgreeFl)
	 * @param addBusiness(businessNickname, businessTel)
	 * @param subCategory(업직종 리스트)
	 * @param businessAddress(사업장주소 리스트 변환용)
	 * @return
	 */
	int addBusiness(Employer loginEmployer, Employer addBusiness, List<String> subCategory, String[] businessAddress);








	/* ********** 사업장 홍보 페이지 관련 ********** */
	
	
	
	/* ********** 제출된 이력서 보기 페이지 관련 ********** */
	
	
	
	/* ********** 회원탈퇴 페이지 관련 ********** */
	
	
}

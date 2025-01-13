package com.jobbuilder.project.myPageEmployer.model.service;

import java.util.List;
import java.util.Map;

import org.springframework.web.multipart.MultipartFile;

import com.jobbuilder.project.board.model.dto.Board;
import com.jobbuilder.project.employer.model.dto.BusinessImg;
import com.jobbuilder.project.employer.model.dto.Employer;
import com.jobbuilder.project.myPageEmployer.model.dto.RecruitmentResume;
import com.jobbuilder.project.recruitment.model.dto.Recruitment;

public interface MyPageEmployerService {
	
	/* ********** 내 정보 보기 페이지 관련 ********** */
	
	/** 고용주 1명의 사업장 리스트 얻어오기
	 * @param memberNo
	 * @return employerNo, businessNickname, businessAddress, businessTel,
	 * 			businessWorktypeList, businessImgList
	 * @author JWJ
	 */
	List<Employer> selectBusinessList(int memberNo);
	
	/** 사업장 정보 얻어오기(내 정보 보기 페이지 내 모달 창)
	 * @param employerNo
	 * @return
	 * @author JWJ
	 */
	Employer getBusiness(int employerNo);
	
	
	/** 각 사업장의 공고목록 얻어오기 (내 정보 보기 페이지 내 모달 창)
	 * @param empNo
	 * @return
	 */
	List<Recruitment> getRecruitmentList(int empNo);
	
	
	/* ********** 기본정보 수정 페이지 관련 ********** */
	/** 비밀번호 확인
	 * @param bodyMap(memberEmail, memberPw)
	 * @return 고용주의 본점 정보
	 */
	Employer checkPw(Map<String, String> bodyMap);
	
	
	
	/* ********** 비밀번호 변경 페이지 관련 ********** */
	
	/** 비밀번호 확인
	 * @param loginEmployer
	 * @param memberPw
	 * @return
	 */
	int checkPw(Employer loginEmployer, String currentPw);
	

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
	
	/** 구인완료여부 변경 (내가 쓴 공고 페이지 내)
	 * @param badyMap(recruitmentNo, complete)
	 * @return
	 */
	int changeRecruitComplete(Map<String, Object> badyMap);

	
	/* ********** 내가 쓴 글 페이지 관련 ********** */
	
	/** 내가 쓴 글 목록 불러오기
	 * @param memberNo
	 * @param cp
	 * @return
	 */
	List<Board> viewMyBoard(int memberNo, int cp);
	
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
	
	/** 사업장 지점명 중복검사
	 * @param bodyMap(businessNickname, memberNo)
	 * @return
	 */
	int checkBusinessNickname(Map<String, String> bodyMap);
	
	/** 사업장 전화번호 중복검사
	 * @param bodyMap(businessTel, memberNo)
	 * @return
	 */
	int checkBusinessTel(Map<String, String> bodyMap);

	/** 사업장 추가
	 * @param loginEmployer(memberNo, businessRegistrationNumber, businessName, membershipLevel, optionalAgreeFl)
	 * @param addBusiness(businessNickname, businessTel)
	 * @param subCategory(업직종 리스트)
	 * @param businessAddress(사업장주소 리스트 변환용)
	 * @return
	 */
	int addBusiness(Employer loginEmployer, Employer addBusiness, List<String> subCategory,
					String[] businessAddress, List<MultipartFile> images) throws Exception;



	/* ********** 사업장 수정 페이지 관련 ********** */
	
	/** 사업장 이미지정보 얻어오기
	 * @param employerNo
	 * @return
	 */
	List<BusinessImg> getBusinessImgList(int employerNo);
	
	/* updateBusiness :Employer(employerNo=13, businessRegistrationNumber=null, businessName=null,
	 * businessAddress=10246,경기 고양시 일산동구 감내길 12-23,바뀐 새주소~, optionalAgreeFl=null,
	 * businessNickname=일산 2점 -> 3점, businessTel=0211154784, businessDelFl=null,
	 * membershipLevel=null, membershipName=null, memberNo=0, memberEmail=null, memberPw=null,
	 * memberName=null, memberTel=null, enrollDate=null, memberDelFl=null, authorityNo=0,
	 * authorityName=null, businessWorktypeList=null, businessWorktype=null, businessImgList=null,
	 * thumbnail=null, recruitmentList=null)
	 * 
	 * subCategory :[교육·강사 기타, 교재·교육콘텐츠제작, 학원운영지원, 국비교육기관, 자격증·기술학원]
	 * 
	 * */
	/** 사업장 수정
	 * @param updateBusiness(employerNo, businessNickname, businessTel)
	 * @param subCategory (업직종, 리스트 형태)
	 * @param businessAddress (주소, 배열 형태)
	 * @param images
	 * @param deleteOrderList
	 * @return
	 * @throws Exception
	 */
	int updateBusiness(Employer updateBusiness, List<String> subCategory, String[] businessAddress,
			List<MultipartFile> images, String deleteOrderList) throws Exception;

	
	/* ********** 사업장 삭제 관련 ********** */

	/** 본점의 memberNo 얻어오기
	 * @param employerNo
	 * @return
	 */
	int getMemberNo(int employerNo);

	/** 해당 사업장 삭제
	 * @param employerNo
	 * @return
	 */
	int deleteBusiness(int employerNo);



	/* ********** 사업장 홍보 페이지 관련 ********** */
	
	
	
	/* ********** 제출된 이력서 보기 페이지 관련 ********** */
	
	/** 공고에 제출된 이력서 조회
	 * @param memberNo
	 * @return
	 */
	Map<List<Integer>, RecruitmentResume> viewResumes(int memberNo);
	
	/** 무한스크롤 테스트용 공고에 제출된 이력서 조회
	 * @param memberNo
	 * @return
	 */
	List<RecruitmentResume> viewResumesList(int memberNo, int cp);

	/** 해당 공고에 제출된 이력서 보기
	 * @param recuritmentNo
	 * @param resumeNo
	 * @return
	 */
	RecruitmentResume viewRecruitResume(int recruitmentNo, int resumeNo);










	
	/* ********** 회원탈퇴 페이지 관련 ********** */
	
	
}

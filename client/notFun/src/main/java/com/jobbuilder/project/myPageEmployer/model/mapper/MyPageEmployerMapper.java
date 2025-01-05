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
	
	/** 사업장 1개의 대표이미지 얻어오기
	 * @param employerNo
	 * @return
	 */
	String selectThumbNail(int employerNo);
	
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
	
	/** 각 사업장의 공고목록 얻어오기
	 * @param empNo
	 * @return
	 */
	List<Recruitment> getRecruitmentList(int empNo);
	
	
	/* ********** 기본정보 수정 페이지 관련 ********** */
	/** 암호화된 비밀번호 얻어오기
	 * @param memberEmail
	 * @return
	 */
	String getPw(String memberEmail);
	
	/** memberEmail을 보유한 고용주의 본점 정보 얻어오기
	 * @param memberEmail
	 * @return
	 */
	Employer getEmployer(String memberEmail);
	
	
	
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
	
	/**  구인완료여부 변경 (내가 쓴 공고 페이지 내)
	 * @param badyMap (recruitmentNo, complete)
	 * @return
	 */
	int changeRecruitComplete(Map<String, Object> badyMap);
	
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




	/* ********** 사업장 수정 페이지 관련 ********** */
	
	/** 사업장 이미지정보 얻어오기
	 * @param employerNo
	 * @return
	 */
	List<BusinessImg> getBusinessImgList(int employerNo);
	
	/** 사업장 수정 (EMPLOYER TABLE 만)
	 * @param updateBusiness(employerNo, businessNickname, businessTel, businessAddress[^^^로 구분])
	 * @return
	 */
	int updateBusiness(Employer updateBusiness);
	
	/** 기존 사업장의 업직종 제거(BUSINESS_WORKTYPE TABLE)
	 * @param employerNo
	 * @return
	 */
	int deleteBusinessWorktype(int employerNo);
	
	/** 원래 있던 이미지 삭제한 경우 BUSINESS_IMG TABLE에서 삭제
	 * @param map (deleteOrderList, employerNo)
	 * @return
	 */
	int deleteImage(Map<String, Object> map);
	
	/** 기존 이미지가 있는 경우 BUSINESS_IMG TABLE에서 UPDATE 
	 * @param img
	 * @return
	 */
	int updateImage(BusinessImg img);
	
	/** 기존 이미지가 없는 경우 BUSINESS_IMG TABLE에 INSERT
	 * @param img
	 * @return
	 */
	int insertImage(BusinessImg img);
	
	
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
	
	
	
	/* ********** 회원 탈퇴 페이지 관련 ********** */
	
	













}

package com.jobbuilder.project.myPageEmployer.model.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import com.jobbuilder.project.employer.model.dto.BusinessImg;
import com.jobbuilder.project.employer.model.dto.BusinessWorktype;
import com.jobbuilder.project.employer.model.dto.Employer;

@Mapper
public interface MyPageEmployerMapper {

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

	/** 사업장 추가(업직종 제외)
	 * @param addBusiness (businessRegistrationNumber, businessName, businessAddress, membershipLevel,
	 * 						memberNo, optionalAgreeFl, businessNickname, businessTel)
	 * @return
	 */
	int addBusiness(Employer addBusiness);

	/** 사업장 추가 시 employerNo 얻어오기
	 * @param businessNickname
	 * @return
	 * @author JWJ
	 */
	int getEmpNo(String businessNickname);

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

}

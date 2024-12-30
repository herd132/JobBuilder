package com.jobbuilder.project.myPageEmployer.model.service;

import java.util.List;
import java.util.Map;

import com.jobbuilder.project.employer.model.dto.Employer;

public interface MyPageEmployerService {

	/** 고용주 1명의 사업장 리스트 얻어오기
	 * @param memberNo
	 * @return employerNo, businessNickname, businessAddress, businessTel,
	 * 			businessWorktypeList, businessImgList
	 * @author JWJ
	 */
	List<Employer> selectBusinessList(int memberNo);

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


}

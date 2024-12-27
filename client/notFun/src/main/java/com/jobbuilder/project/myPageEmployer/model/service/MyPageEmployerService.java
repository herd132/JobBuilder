package com.jobbuilder.project.myPageEmployer.model.service;

import java.util.List;

import com.jobbuilder.project.employer.model.dto.Employer;

public interface MyPageEmployerService {

	/** 고용주 1명의 사업장 리스트 얻어오기
	 * @param memberNo
	 * @return employerNo, businessNickname, businessAddress, businessTel,
	 * 			businessWorktypeList, businessImgList
	 * @author JWJ
	 */
	List<Employer> selectBusinessList(int memberNo);

}

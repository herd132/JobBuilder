package com.jobbuilder.project.recruitment.model.serivce;

import java.util.List;

import com.jobbuilder.project.employer.model.dto.Employer;

public interface RecruitmentService {

	/** 사업장 정보 얻어오기
	 * @param memberNo
	 * @return
	 * @author JWJ
	 */
	List<Employer> selectBusinessList(int memberNo);

}

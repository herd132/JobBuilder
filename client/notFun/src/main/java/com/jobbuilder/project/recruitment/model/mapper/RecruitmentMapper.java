package com.jobbuilder.project.recruitment.model.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.jobbuilder.project.employer.model.dto.Employer;

@Mapper
public interface RecruitmentMapper {

	/** 사업장 정보 얻어오기
	 * @param memberNo
	 * @return
	 * @author JWJ
	 */
	List<Employer> selectBusinessList(int memberNo);

}

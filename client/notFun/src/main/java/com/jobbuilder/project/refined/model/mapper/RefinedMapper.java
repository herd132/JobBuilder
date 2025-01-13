package com.jobbuilder.project.refined.model.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.jobbuilder.project.refined.model.dto.Refined;

@Mapper
public interface RefinedMapper {

	List<Refined> getRecruitmentList();

	List<Refined> getRecruitmentListb(int recruitmentNo);

	List<Refined> refinedAddress1();

	List<Refined> refinedAddress2();

	List<Refined> refineJob1();
	
	List<Refined> refineJob2();

	/*
	List<ResumeDaysTime> resumeDaysTime(int recruitmentNo);

	List<String> resumeJobTypeList(int recruitmentNo);

	List<ResumeWorkType> resumeWorkType(int recruitmentNo);

	List<String> workcondAddressTypeInfo(int recruitmentNo);
	*/
}

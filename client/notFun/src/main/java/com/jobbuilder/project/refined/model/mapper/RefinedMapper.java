package com.jobbuilder.project.refined.model.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.jobbuilder.project.refined.model.dto.Refined;

@Mapper
public interface RefinedMapper {

	List<Refined> getRecruitmentList(int recruitmentNo);

	List<Refined> getRecruitmentListb(int recruitmentNo);

	/*
	List<ResumeDaysTime> resumeDaysTime(int recruitmentNo);

	List<String> resumeJobTypeList(int recruitmentNo);

	List<ResumeWorkType> resumeWorkType(int recruitmentNo);

	List<String> workcondAddressTypeInfo(int recruitmentNo);
	*/
}

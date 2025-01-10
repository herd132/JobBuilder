package com.jobbuilder.project.refined.model.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.jobbuilder.project.refined.model.dto.Refined;
import com.jobbuilder.project.resume.model.dto.ResumeDaysTime;
import com.jobbuilder.project.resume.model.dto.ResumeWorkType;

@Mapper
public interface RefinedMapper {

	List<Refined> getRecruitmentList(int recruitmentNo);

	/*
	List<ResumeDaysTime> resumeDaysTime(int recruitmentNo);

	List<String> resumeJobTypeList(int recruitmentNo);

	List<ResumeWorkType> resumeWorkType(int recruitmentNo);

	List<String> workcondAddressTypeInfo(int recruitmentNo);
	*/
}

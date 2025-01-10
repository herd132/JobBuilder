package com.jobbuilder.project.refined.model.service;

import java.util.List;

import com.jobbuilder.project.refined.model.dto.Refined;
import com.jobbuilder.project.resume.model.dto.ResumeDaysTime;
import com.jobbuilder.project.resume.model.dto.ResumeWorkType;

public interface RefinedService {

	List<Refined> getRecruitmentList(int recruitmentNo);

	List<Refined> getRecruitmentListb(int recruitmentNo);

	/*
	List<ResumeWorkType> resumeWorkType(int recruitmentNo);

	List<String> resumeJobTypeList(int recruitmentNo);

	List<ResumeDaysTime> resumeDaysTime(int recruitmentNo);
	
	List<String> workcondAddressTypeInfo(int recruitmentNo);
*/
	

}

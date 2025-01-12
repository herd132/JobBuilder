package com.jobbuilder.project.refined.model.service;

import java.util.List;

import com.jobbuilder.project.refined.model.dto.Refined;

public interface RefinedService {

	List<Refined> getRecruitmentList();

	List<Refined> getRecruitmentListb(int recruitmentNo);

	List<Refined> refinedAddress1();

	List<Refined> refinedAddress2();

	List<Refined> refineJob1();

	List<Refined> refineJob2();

	
	
	
	
	/*
	List<ResumeWorkType> resumeWorkType(int recruitmentNo);

	List<String> resumeJobTypeList(int recruitmentNo);

	List<ResumeDaysTime> resumeDaysTime(int recruitmentNo);
	
	List<String> workcondAddressTypeInfo(int recruitmentNo);
*/
	

}

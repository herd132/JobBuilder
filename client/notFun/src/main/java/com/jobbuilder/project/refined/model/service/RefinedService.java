package com.jobbuilder.project.refined.model.service;

import java.util.List;
import java.util.Map;

import com.jobbuilder.project.refined.model.dto.Refined;

public interface RefinedService {

	List<Refined> getRecruitmentList();

	

	List<Refined> refinedAddress1();

	List<Refined> refinedAddress2();

	List<Refined> refineJob1();

	List<Refined> refineJob2();



	List<Refined> getRecruitmentListb(Map<String, List<String>> categorySelections);

	
	
	
	
	/*
	List<ResumeWorkType> resumeWorkType(int recruitmentNo);

	List<String> resumeJobTypeList(int recruitmentNo);

	List<ResumeDaysTime> resumeDaysTime(int recruitmentNo);
	
	List<String> workcondAddressTypeInfo(int recruitmentNo);
*/
	

}

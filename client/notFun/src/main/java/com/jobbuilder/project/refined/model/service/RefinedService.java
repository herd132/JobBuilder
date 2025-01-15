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

	List<Refined> refinePeriod2();
	
	List<Refined> refineDays2();

	List<Refined> refineTime2();

	List<Refined> refineJobType2();

	List<Refined> refineGrade2();

	List<Refined> refineSupport2();

	List<Refined> refinePreferred2();
	

}

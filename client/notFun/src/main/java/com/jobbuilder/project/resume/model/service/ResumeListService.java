package com.jobbuilder.project.resume.model.service;

import java.util.List;
import java.util.Map;

import com.jobbuilder.project.recruitment.model.dto.Recruitment;
import com.jobbuilder.project.resume.model.dto.CareerInfo;
import com.jobbuilder.project.resume.model.dto.Resume;
import com.jobbuilder.project.resume.model.dto.ResumeDaysTime;
import com.jobbuilder.project.resume.model.dto.ResumeWorkType;

public interface ResumeListService {

	List<Resume> getResumeList(int workerNo);

	int updateResumeStatus(Resume resume);

	Resume getResumeByNo(int resumeNo);

	List<Recruitment> getRecommendations(int resumeNo);

	List<CareerInfo> careerInfo(int resumeNo);

	List<ResumeWorkType> resumeWorkType(int resumeNo);

	List<String> resumeJobTypeList(int resumeNo);

	List<ResumeDaysTime> resumeDaysTime(int resumeNo);

	int updateResumeContent(Map<String, Object> requestBody);


	

	
}

package com.jobbuilder.project.resume.model.service;

import java.util.List;

import com.jobbuilder.project.recruitment.model.dto.Recruitment;
import com.jobbuilder.project.resume.model.dto.Resume;

public interface ResumeListService {

	List<Resume> getResumeList(int workerNo);

	int updateResumeStatus(Resume resume);

	Resume getResumeByNo(int resumeNo);

	List<Recruitment> getRecommendations(int resumeNo);


	
}

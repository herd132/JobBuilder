package com.jobbuilder.project.resume.model.service;

import java.util.List;

import com.jobbuilder.project.resume.model.dto.Resume;

public interface ResumeListService {

	List<Resume> getResumeList(int workerNo);


	
}

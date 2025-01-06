package com.jobbuilder.project.resume.model.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.springframework.data.repository.query.Param;

import com.jobbuilder.project.recruitment.model.dto.Recruitment;
import com.jobbuilder.project.resume.model.dto.Resume;

@Mapper
public interface ResumeListMapper {

	List<Resume> getResumeList(int workerNo);

	int updateResumeStatus(int resumeNo, int updateType, String value);

	int updateResumeHideStatus(Resume resume);

	int updateResumeDeleteStatus(Resume resume);

	Resume selectResumeByNo(int resumeNo);

	List<Recruitment> selectRecommendationsByResumeNo(int resumeNo);

	
}

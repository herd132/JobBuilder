package com.jobbuilder.project.resume.model.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.springframework.data.repository.query.Param;

import com.jobbuilder.project.recruitment.model.dto.Recruitment;
import com.jobbuilder.project.resume.model.dto.CareerInfo;
import com.jobbuilder.project.resume.model.dto.Resume;
import com.jobbuilder.project.resume.model.dto.ResumeDaysTime;
import com.jobbuilder.project.resume.model.dto.ResumeWorkType;

@Mapper
public interface ResumeListMapper {

	List<Resume> getResumeList(int workerNo);

	int updateResumeStatus(int resumeNo, int updateType, String value);

	int updateResumeHideStatus(Resume resume);

	int updateResumeDeleteStatus(Resume resume);

	Resume selectResumeByNo(int resumeNo);

	List<Recruitment> selectRecommendationsByResumeNo(int resumeNo);

	List<CareerInfo> careerInfo(int resumeNo);

	List<ResumeWorkType> resumeWorkType(int resumeNo);

	List<String> resumeJobTypeList(int resumeNo);

	List<ResumeDaysTime> resumeDaysTime(int resumeNo);

	int updateResumeContent(Map<String, Object> requestBody);

	
}

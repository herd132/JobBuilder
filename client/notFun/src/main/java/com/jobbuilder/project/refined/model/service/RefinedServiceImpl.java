package com.jobbuilder.project.refined.model.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.jobbuilder.project.refined.model.dto.Refined;
import com.jobbuilder.project.refined.model.mapper.RefinedMapper;
import com.jobbuilder.project.resume.model.dto.ResumeDaysTime;
import com.jobbuilder.project.resume.model.dto.ResumeWorkType;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
@Slf4j
public class RefinedServiceImpl implements RefinedService {

	private final RefinedMapper mapper;
	
	@Override
	public List<Refined> getRecruitmentList(int recruitmentNo) {
		return mapper.getRecruitmentList(recruitmentNo);
	}
	
	/*
	@Override
	public List<ResumeDaysTime> resumeDaysTime(int recruitmentNo) {
		return mapper.resumeDaysTime(recruitmentNo);
	}
	
	@Override
	public List<String> resumeJobTypeList(int recruitmentNo) {
		return mapper.resumeJobTypeList(recruitmentNo);
	}
	
	@Override
	public List<ResumeWorkType> resumeWorkType(int recruitmentNo) {
		return mapper.resumeWorkType(recruitmentNo);
	}
	
	@Override
	public List<String> workcondAddressTypeInfo(int recruitmentNo) {
		return mapper.workcondAddressTypeInfo(recruitmentNo);
	}
	*/
	
	
	
	
	
	
	
	
	
	
	
	
}

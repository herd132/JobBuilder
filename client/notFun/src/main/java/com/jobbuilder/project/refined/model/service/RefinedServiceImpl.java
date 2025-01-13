package com.jobbuilder.project.refined.model.service;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.jobbuilder.project.refined.model.dto.Refined;
import com.jobbuilder.project.refined.model.mapper.RefinedMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
@Slf4j
public class RefinedServiceImpl implements RefinedService {

	private final RefinedMapper mapper;
	
	@Override
	public List<Refined> getRecruitmentList() {
		return mapper.getRecruitmentList();
	}
	
	@Override
	public List<Refined> getRecruitmentListb(Map<String, List<String>> categorySelections) {
		return mapper.getRecruitmentListb(categorySelections);
	}
	
	@Override
	public List<Refined> refinedAddress1() {
		return mapper.refinedAddress1();
	}
	
	@Override
	public List<Refined> refinedAddress2() {
		return mapper.refinedAddress2();
	}
	
	@Override
	public List<Refined> refineJob1() {
		return mapper.refineJob1();
	}
	
	@Override
	public List<Refined> refineJob2() {
		return mapper.refineJob2();
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

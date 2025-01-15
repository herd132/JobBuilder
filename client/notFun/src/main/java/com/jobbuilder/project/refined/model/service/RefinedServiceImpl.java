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
	
	@Override
	public List<Refined> refinePeriod2() {
		return mapper.refinePeriod2();
	}
	
	@Override
	public List<Refined> refineDays2() {
		return mapper.refineDays2();
	}
	
	@Override
	public List<Refined> refineTime2() {
		return mapper.refineTime2();
	}
	
	@Override
	public List<Refined> refineJobType2() {
		return mapper.refineJobType2();
	}
	
	@Override
	public List<Refined> refineGrade2() {
		return mapper.refineGrade2();
	}
	
	@Override
	public List<Refined> refineSupport2() {
		return mapper.refineSupport2();
	}
	
	@Override
	public List<Refined> refinePreferred2() {
		return mapper.refinePreferred2();
	}
	
	@Override
	public List<Refined> refineSalary2() {
		return mapper.refineSalary2();
	}
	
	
	
	
	
	
	
}

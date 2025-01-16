package com.jobbuilder.project.main.model.service;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.jobbuilder.project.main.model.dto.Brand;
import com.jobbuilder.project.main.model.mapper.MainMapper;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class MainServiceImpl implements MainService{
	
	private final MainMapper mapper;

	// 메인페이지 Top10 공고(로고)출력 (누적결제금액 많은순)
	@Override
	public List<Brand> selectTopBrand() {
		return mapper.selectTopBrand();
	}
	
	// 타입별 멤버십 공고 조회
	@Override
	public List<Brand> selectMembershipList(int type) {
		return mapper.selectMembershipList(type);
	}
	
	// 가장 최근 공고 10개 조회
	@Override
	public List<Brand> selectRecentRecruitments() {
		return mapper.selectRecentRecruitments();
	}
}

package com.jobbuilder.project.main.model.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.jobbuilder.project.main.model.dto.Brand;
import com.jobbuilder.project.main.model.mapper.MainMapper;

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
	
	@Override
	public List<Brand> selectPlatinumList() {
		// TODO Auto-generated method stub
		return null;
	}
}

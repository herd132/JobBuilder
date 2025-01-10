package com.jobbuilder.project.resume.model.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.jobbuilder.project.employer.model.dto.Employer;
import com.jobbuilder.project.recruitment.model.dto.Recruitment;
import com.jobbuilder.project.resume.model.dto.Resume;
import com.jobbuilder.project.resume.model.mapper.RecommendMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class RecommendServiceImpl implements RecommendService{

	public final RecommendMapper mapper;

	// 추천 이력서 조회
	@Override
	public List<Map<String, Object>> revommendResumeList(int memberNo, int recruitmentNo) {
		Map<String, Integer> map = new HashMap<>();
		
		map.put("memberNo", memberNo);
		map.put("recruitmentNo", recruitmentNo);
		
		List<Map<String, Object>> list = mapper.revommendResumeList(map);
		
		return list;
	}

	// 상세 조회 시 추천 이력서 수 조회 카운트
	@Override
	public Integer getRecommendCount(Recruitment recruitment) {
		
		return mapper.getRecommendCount(recruitment);
	}
}

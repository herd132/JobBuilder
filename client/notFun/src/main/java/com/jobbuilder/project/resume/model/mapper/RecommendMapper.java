package com.jobbuilder.project.resume.model.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import com.jobbuilder.project.recruitment.model.dto.Recruitment;
import com.jobbuilder.project.resume.model.dto.Resume;

@Mapper
public interface RecommendMapper {

	// 추천 이력서 조회
	List<Map<String, Object>> revommendResumeList(Map<String, Integer> map);

	// 추천 이력수 수 카운트
	int getRecommendCount(Recruitment recruitment);

}

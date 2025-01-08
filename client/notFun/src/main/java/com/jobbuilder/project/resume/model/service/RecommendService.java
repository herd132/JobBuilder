package com.jobbuilder.project.resume.model.service;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.jobbuilder.project.employer.model.dto.Employer;
import com.jobbuilder.project.recruitment.model.dto.Recruitment;
import com.jobbuilder.project.resume.model.dto.Resume;

@Service
public interface RecommendService {

	/** 추천 이력서 목록 조회
	 * @param memberNo
	 * @param recruitmentNo
	 * @return
	 */
	List<Map<String, Object>> revommendResumeList(int memberNo, int recruitmentNo);

	/** 상세 조회 시 추천 이력수 작성
	 * @param recruitmentNo
	 * @param loginEmployer
	 * @return
	 */
	int getRecommendCount(Recruitment recruitment);

}

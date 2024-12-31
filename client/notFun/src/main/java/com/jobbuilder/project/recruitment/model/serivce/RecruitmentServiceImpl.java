package com.jobbuilder.project.recruitment.model.serivce;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.jobbuilder.project.employer.model.dto.Employer;
import com.jobbuilder.project.recruitment.model.mapper.RecruitmentMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
@Slf4j
public class RecruitmentServiceImpl implements RecruitmentService{

	/* ********** 필드 ********** */
	private final RecruitmentMapper mapper;
	
	/* ********** 메서드 ********** */
	
	@Override	// 사업장 정보 얻어오기
	public List<Employer> selectBusinessList(int memberNo) {
		return mapper.selectBusinessList(memberNo);
	}
	
	@Override	// 선호조건 리스트 불러오기
	public List<Map<String, String>> selectPreferredList() {
		return mapper.selectPreferredList();
	}
	
	@Override	// 복리후생 대분류 불러오기
	public List<Map<String, String>> selectSupportTitleList() {
		return mapper.selectSupportTitleList();
	}
	
	@Override	// 복리후생 소분류 불러오기
	public List<Map<String, String>> selectSubSupportList(String supportNo) {
		// TODO Auto-generated method stub
		return mapper.selectSubSupportList(supportNo);
	}
}

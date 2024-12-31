package com.jobbuilder.project.recruitment.model.serivce;

import java.util.List;

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
}

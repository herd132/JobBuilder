package com.jobbuilder.project.resume.model.service;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.jobbuilder.project.resume.model.dto.Resume;
import com.jobbuilder.project.resume.model.mapper.ResumeMapper;
import com.jobbuilder.project.worker.model.dto.Worker;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
@Slf4j
public class ResumeServiceImpl implements ResumeService{
	
	private final ResumeMapper mapper;

	@Override	// 대분류 리스트 얻어오기
	public List<Map<String,String>> selectMajorCategory() {
		return mapper.selectMajorCategory();
	}
	
	@Override	// workType 가 일치한 소분류 업직종 불러오기
	public List<Map<String, String>> selectsubCategoryList(String workTypeNo) {
		return mapper.selectsubCategoryList(workTypeNo);
	}

	@Override // 이력서 작성 테스트
	public int writeResume(Worker loginWorker, int gradeNo, int workDateNo, int payType, int inputPay) {
		
		return 0;
		
//		Resume addResume = new Resume();
//		addResume.setGradeNo(gradeNo);
//		addResume.setInputPay(inputPay);
//		addResume.setPayType(payType);
//		addResume.setWorkDateNo(workDateNo);
//		addResume.setWorkerNo(loginWorker.getWorkerNo());
		
//		return mapper.writeResume(addResume);
		
	}

}

package com.jobbuilder.project.resume.model.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.jobbuilder.project.resume.model.dto.CareerInfo;
import com.jobbuilder.project.resume.model.dto.Resume;
import com.jobbuilder.project.resume.model.dto.ResumeDaysTime;
import com.jobbuilder.project.resume.model.mapper.ResumeMapper;
import com.jobbuilder.project.worker.model.dto.Worker;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
@Slf4j
public class ResumeServiceImpl implements ResumeService {

	private final ResumeMapper mapper;

	@Override // 대분류 리스트 얻어오기
	public List<Map<String, String>> selectMajorCategory() {
		return mapper.selectMajorCategory();
	}

	@Override // workType 가 일치한 소분류 업직종 불러오기
	public List<Map<String, String>> selectsubCategoryList(String workTypeNo) {
		return mapper.selectsubCategoryList(workTypeNo);
	}

	// 이력서 작성
	@Override
	public int writeResume(Resume resume, List<String> workTypeList, List<Integer> jobTypeNoList,
			List<CareerInfo> careerInfoList, List<ResumeDaysTime> daysTimeList) {

		// 1. RESUME 테이블 INSERT
		int result = mapper.insertResume(resume);

		// 삽입 실패 시
		if (result == 0) {
			throw new RuntimeException("RESUME 삽입 중 예외 발생");
		}

		// 2. RESUME_PERIOD 삽입(resume에 selectKey에 의한 이력서 번호 세팅되어있음)
		result = mapper.insertResumePeriod(resume);

		// 삽입 실패 시
		if (result == 0) {
			throw new RuntimeException("RESUME_PERIOD 삽입 중 예외 발생");
		}

		int resumeNo = resume.getResumeNo();

		// 3. RESUME 관련 RESUME_WORKTYPE 삽입
		Map<String, Object> workTypeMap = new HashMap<>();
		workTypeMap.put("resumeNo", resumeNo);
		workTypeMap.put("workTypeList", workTypeList);

		// ex ) {"resumeNo" : 1, "workTypeList" : [1002, 1001, 1010]}
		result = mapper.insertResumeWorkType(workTypeMap);
		if (result != workTypeList.size()) {
			throw new RuntimeException("RESUME_WORKTYPE 삽입 중 예외 발생");
		}

		// 4. RESUME 관련 RESUME_JOB_TYPE 삽입
		Map<String, Object> jobTypeMap = new HashMap<>();
		jobTypeMap.put("resumeNo", resumeNo);
		jobTypeMap.put("jobTypeNoList", jobTypeNoList);
		
		result = mapper.insertResumeJobType(jobTypeMap);
		if (result != jobTypeNoList.size()) {
			throw new RuntimeException("RESUME_JOB_TYPE 삽입 중 예외 발생");
		}

		// 5. RESUME_DAYSTIME 삽입
		// dayTimesList에 resumeNo 각각 세팅
		for (ResumeDaysTime daysTime : daysTimeList) {
			daysTime.setResumeNo(resumeNo);
		}

		result = mapper.insertResumeDaysTime(daysTimeList);
		if (result != daysTimeList.size()) {
			throw new RuntimeException("RESUME_DAYSTIME 삽입 중 예외 발생");
		}

		// 6. CAREER_INFO 삽입 -> RESUME_CAREER 삽입
		if(careerInfoList != null) {
			
			for (CareerInfo careerInfo : careerInfoList) {
				
				careerInfo.setWorkerNo(resume.getWorkerNo());
				
				// 6-1. CAREER_INFO 삽입
				result = mapper.insertCareerInfo(careerInfo);
				if (result == 0) {
					throw new RuntimeException("CAREER_INFO 삽입 중 예외 발생");
				}
				
				// 6-2. RESUME_CAREER 삽입
				Map<String, Integer> resumeCareerMap = new HashMap<>();
				resumeCareerMap.put("resumeNo", resumeNo);
				resumeCareerMap.put("careerNo", careerInfo.getCareerNo());
				
				result = mapper.insertResumeCareer(resumeCareerMap);
				if (result == 0) {
					throw new RuntimeException("RESUME_CAREER 삽입 중 예외 발생");
				}
			}
			
		}

		return result;
	}

}

package com.jobbuilder.project.resume.model.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.RowBounds;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.jobbuilder.project.board.model.dto.Pagination;
import com.jobbuilder.project.resume.model.dto.CareerInfo;
import com.jobbuilder.project.resume.model.dto.Resume;
import com.jobbuilder.project.resume.model.dto.ResumeDaysTime;
import com.jobbuilder.project.resume.model.mapper.ResumeMapper;
import com.jobbuilder.project.serviceCenter.model.dto.ServiceCenter;
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
	public int writeResume(Resume resume, List<String> workTypeList, List<String> addressList,
			List<Integer> jobTypeNoList, List<CareerInfo> careerInfoList, List<ResumeDaysTime> daysTimeList) {

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

		// addressList 삽입
		Map<String, Object> addressMap = new HashMap<>();
		addressMap.put("resumeNo", resumeNo);
		addressMap.put("addressList", addressList);

		result = mapper.insertResumeAddress(addressMap);
		if (result != addressList.size()) {
			throw new RuntimeException("RESUME_ADDRESS 삽입 중 예외 발생");
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
		if (careerInfoList != null) {

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

	// 주소 대분류 불러오기
	@Override
	public List<Map<String, String>> selectAddressList() {
		return mapper.selectAddressList();
	}

	// 주소 소분류 불러오기
	@Override
	public List<Map<String, String>> selectSubAddress(String workcondAddressTypeNo) {
		return mapper.selectSubAddress(workcondAddressTypeNo.substring(0, 2));
	}

	// 이력서 수정
	@Override
	public int updateCategory(Resume resume, List<String> workTypeList, List<String> addressList,
			List<Integer> jobTypeNoList, List<ResumeDaysTime> daysTimeList) {

		// 1. RESUME 테이블 수정
		int result = mapper.updateCategory(resume);

		if (result == 0) {
			throw new RuntimeException("RESUME 삽입 중 예외 발생");
		}

		// 2. RESUME_PERIOD 수정
		result = mapper.updateCategoryperiod(resume);

		// 삽입 실패 시
		if (result == 0) {
			throw new RuntimeException("RESUME_PERIOD 삽입 중 예외 발생");
		}

		int resumeNo = resume.getResumeNo();

		// 3. RESUME 관련 RESUME_WORKTYPE 수정
		Map<String, Object> workTypeMap = new HashMap<>();
		workTypeMap.put("resumeNo", resumeNo);
		workTypeMap.put("workTypeList", workTypeList);

		// ex ) {"resumeNo" : 1, "workTypeList" : [1002, 1001, 1010]}

		int result1 = mapper.updateCategoryWorkTypeDelete(workTypeMap);

		if (result1 > 0) {

			result = mapper.updateCategoryWorkType(workTypeMap);
		}

		// addressList 수정
		Map<String, Object> addressMap = new HashMap<>();
		addressMap.put("resumeNo", resumeNo);
		addressMap.put("addressList", addressList);

		result1 = mapper.updateCategoryAddressDelete(addressMap);

		if (result1 > 0) {
			result = mapper.updateCategoryAddress(addressMap);
		}

		// 4. RESUME 관련 RESUME_JOB_TYPE 수정
		Map<String, Object> jobTypeMap = new HashMap<>();
		jobTypeMap.put("resumeNo", resumeNo);
		jobTypeMap.put("jobTypeNoList", jobTypeNoList);

		result1 = mapper.updateCategoryJobTypeDelete(jobTypeMap);
		if (result1 > 0) {
			result = mapper.updateCategoryJobType(jobTypeMap);
		}

		// 5. RESUME_DAYSTIME 수정
		// dayTimesList에 resumeNo 각각 세팅
		for (ResumeDaysTime daysTime : daysTimeList) {
			daysTime.setResumeNo(resumeNo);
			log.debug("daysTime : " + daysTime);
		}

		Map<String, Object> daysTimeMap = new HashMap<>();
		daysTimeMap.put("resumeNo", resumeNo);
		daysTimeMap.put("list", daysTimeList);
		result1 = mapper.updateCategoryDaysTimeDelete(daysTimeMap);

		if (result1 > 0) {
			result = mapper.updateCategoryDaysTime(daysTimeList);
		}
		return result;

	}

	// 제목 수정
	@Override
	public int updateTitle(Map<String, Object> requestBody) {
		return mapper.updateTitle(requestBody);
	}

	@Override
	public int updateGrade(Resume resume, List<CareerInfo> careerInfoList) {

		int resumeNo = resume.getResumeNo();
		
		int result = mapper.updateGrade(resume);

		List<Integer> resumeCareerNoList = mapper.getCareerNoList(resume.getResumeNo());

		for (int resumeCareerNo : resumeCareerNoList) {

			result = mapper.deleteResumeCareer(resumeCareerNo);
			
			result = mapper.deleteCareerInfo(resumeCareerNo);
		}
		
		if(result == 0) {
			throw new RuntimeException("CAREER_INFO 삽입 중 예외 발생");
		}

		if (careerInfoList != null) {

			for (CareerInfo careerInfo : careerInfoList) {

				careerInfo.setWorkerNo(resume.getWorkerNo());

				// 6-1. CAREER_INFO 삽입
				result = mapper.updateCareerInfo(careerInfo);
				if (result == 0) {
					throw new RuntimeException("CAREER_INFO 삽입 중 예외 발생");
				}

				// 6-2. RESUME_CAREER 삽입
				Map<String, Integer> resumeCareerMap = new HashMap<>();
				resumeCareerMap.put("resumeNo", resumeNo);
				resumeCareerMap.put("careerNo", careerInfo.getCareerNo());

				result = mapper.updateResumeCareer(resumeCareerMap);
				if (result == 0) {
					throw new RuntimeException("RESUME_CAREER 삽입 중 예외 발생");
				}
			}
		}

		return result;
	}
	
	// 인재정보 리스트
	@Override
	public Map<String, Object> resumeTotalList(int cp) {
		
		int listCount = mapper.getResumeTotalListCount();
		
		Pagination pagination = new Pagination(cp, listCount, 14, 5);
		
		int limit = pagination.getLimit();
		int offset = (cp - 1 ) * limit;
		RowBounds rowBounds = new RowBounds(offset, limit);
		
		List<Map<String, Object>> resumeTotalList = mapper.resumeTotalList(rowBounds); 
		
		Map<String, Object> map = new HashMap<>();
		
		map.put("pagination", pagination);
		map.put("resumeTotalList", resumeTotalList);
		
		return map;
	}
}

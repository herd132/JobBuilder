package com.jobbuilder.project.resume.model.service;

import java.util.List;
import java.util.Map;

import com.jobbuilder.project.resume.model.dto.CareerInfo;
import com.jobbuilder.project.resume.model.dto.Resume;
import com.jobbuilder.project.resume.model.dto.ResumeDaysTime;
import com.jobbuilder.project.worker.model.dto.Worker;

public interface ResumeService {

	/** 대분류 리스트 얻어오기
	 * @return
	 * @author JWJ
	 */
	List<Map<String,String>> selectMajorCategory();
	
	/** workType 가 일치한 소분류 업직종 불러오기
	 * @param workTypeNo
	 * @return
	 * @author JWJ
	 */
	List<Map<String, String>> selectsubCategoryList(String workTypeNo);

	
	/** 이력서 작성
	 * @param resume
	 * @param workTypeList
	 * @param jobTypeNoList
	 * @param careerInfoList
	 * @param daysTimeList
	 * @return
	 */
	int writeResume(Resume resume, List<String> workTypeList, List<Integer> jobTypeNoList, List<CareerInfo> careerInfoList, List<ResumeDaysTime> daysTimeList);


}

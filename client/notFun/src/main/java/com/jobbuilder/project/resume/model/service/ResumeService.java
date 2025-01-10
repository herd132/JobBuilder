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

	/** 주소 대분류 불러오기
	 * @return
	 */
	List<Map<String, String>> selectAddressList();

	/** 주소 소분류 불러오기
	 * @param workcondAddressTypeNo
	 * @return
	 */
	List<Map<String, String>> selectSubAddress(String workcondAddressTypeNo);
	
	/** 이력서 작성
	 * @param resume
	 * @param workTypeList
	 * @param jobTypeNoList
	 * @param careerInfoList
	 * @param daysTimeList
	 * @return
	 */
	int writeResume(Resume resume, List<String> workTypeList, List<String> addressList, List<Integer> jobTypeNoList, List<CareerInfo> careerInfoList, List<ResumeDaysTime> daysTimeList);

	/** 희망근무 조건 업데이트
	 * @param resume
	 * @param workTypeList
	 * @param addressList
	 * @param jobTypeNoList
	 * @param daysTimeListJson
	 * @return
	 */
	int updateCategory(Resume resume, List<String> workTypeList, List<String> addressList, List<Integer> jobTypeNoList,
			List<ResumeDaysTime> daysTimeList);




}

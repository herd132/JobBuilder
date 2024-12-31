package com.jobbuilder.project.resume.model.service;

import java.util.List;
import java.util.Map;

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

	/** 이력서 작성 테스트
	 * @param loginWorker
	 * @param gradeNo
	 * @param workDate
	 * @param payType
	 * @return
	 */
	int writeResume(Worker loginWorker, int gradeNo, int workDateNo, int payType, int inputPay);


}

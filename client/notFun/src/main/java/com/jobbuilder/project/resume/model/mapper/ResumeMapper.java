package com.jobbuilder.project.resume.model.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import com.jobbuilder.project.resume.model.dto.CareerInfo;
import com.jobbuilder.project.resume.model.dto.Resume;
import com.jobbuilder.project.resume.model.dto.ResumeDaysTime;

@Mapper
public interface ResumeMapper {

	/**
	 * 대분류 리스트 얻어오기
	 * 
	 * @return
	 * @author JWJ
	 */
	List<Map<String, String>> selectMajorCategory();

	/**
	 * workType 가 일치한 소분류 업직종 불러오기
	 * 
	 * @param workTypeNo
	 * @return
	 * @author JWJ
	 */
	List<Map<String, String>> selectsubCategoryList(String workTypeNo);

	/**
	 * 주소 대분류 불러오기
	 * 
	 * @return
	 */
	List<Map<String, String>> selectAddressList();

	/**
	 * 주소 소분류 불러오기
	 * 
	 * @param workcondAddressTypeNo
	 * @return
	 */
	List<Map<String, String>> selectSubAddress(String workcondAddressTypeNo);

	/**
	 * 이력서 기본 작성
	 * 
	 * @param resume
	 * @return
	 */
	int insertResume(Resume resume);

	int insertResumePeriod(Resume resume);

	int insertResumeWorkType(Map<String, Object> map);

	int insertResumeJobType(Map<String, Object> map);

	int insertResumeDaysTime(List<ResumeDaysTime> daysTimeList);

	int insertCareerInfo(CareerInfo careerInfo);

	int insertResumeCareer(Map<String, Integer> resumeCareerMap);

	int insertResumeAddress(Map<String, Object> map);

	/**
	 * 이력서 업데이트
	 * 
	 * @param resume
	 * @return
	 */
	int updateCategory(Resume resume);

	int updateCategoryperiod(Resume resume);

	int updateCategoryWorkTypeDelete(Map<String, Object> Map);

	int updateCategoryWorkType(Map<String, Object> Map);

	int updateCategoryAddressDelete(Map<String, Object> Map);

	int updateCategoryAddress(Map<String, Object> addressMap);

	int updateCategoryJobTypeDelete(Map<String, Object> Map);

	int updateCategoryJobType(Map<String, Object> Map);

	int updateCategoryDaysTimeDelete(Map<String, Object> daysTimeMap);

	int updateCategoryDaysTime(List<ResumeDaysTime> daysTimeList);

	
	/** 제목 수정
	 * @param requestBody
	 * @return
	 */
	int updateTitle(Map<String, Object> requestBody);

	/** 이력서 학력 수정
	 * @param resumeNo
	 * @param gradeNo
	 * @return
	 */

	int updateGrade(Resume resume);
	
	List<Integer> getCareerNoList(int resumeNo);

	int deleteResumeCareer(int resumeCareerNo);

	int deleteCareerInfo(int resumeCareerNo);

	int updateCareerInfo(CareerInfo careerInfo);

	int updateResumeCareer(Map<String, Integer> resumeCareerMap);
	
	





}

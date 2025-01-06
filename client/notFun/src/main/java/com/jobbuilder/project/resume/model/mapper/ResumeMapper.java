package com.jobbuilder.project.resume.model.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import com.jobbuilder.project.resume.model.dto.CareerInfo;
import com.jobbuilder.project.resume.model.dto.Resume;
import com.jobbuilder.project.resume.model.dto.ResumeDaysTime;

@Mapper
public interface ResumeMapper {

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

	/** 이력서 기본 작성 
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

}

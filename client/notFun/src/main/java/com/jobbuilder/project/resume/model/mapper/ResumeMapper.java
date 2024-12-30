package com.jobbuilder.project.resume.model.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

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

}

package com.jobbuilder.project.serviceCenter.model.service;

import java.util.List;
import java.util.Map;

import org.springframework.web.multipart.MultipartFile;

import com.jobbuilder.project.serviceCenter.model.dto.InquiryOneOnOne;
import com.jobbuilder.project.serviceCenter.model.dto.ServiceCenter;

public interface ServiceCenterService {
	
	/** 고객센터 글 리스트 조회 종합
	 * @param i
	 * @param cp
	 * @return
	 */
	Map<String, Object> serviceCenterList(int typeNo, int cp);

	/** 유저 문의 글 작성
	 * @param images
	 * @param inquiry
	 * @return
	 */
	int inquiryInsert(List<MultipartFile> images, InquiryOneOnOne inquiry) throws Exception;

	/** 접속한 유저 문의내역 가져오기
	 * @param memberNo
	 * @param cp
	 * @return
	 */
	Map<String, Object> selectInquiryList(int memberNo, int cp);

	ServiceCenter selectOne(Map<String, Integer> map);

	int updateReadCount(int serviceCenterNo);

}

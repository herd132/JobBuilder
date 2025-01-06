package com.jobbuilder.project.serviceCenter.model.service;

import java.util.List;
import java.util.Map;

import org.springframework.web.multipart.MultipartFile;

import com.jobbuilder.project.serviceCenter.model.dto.InquiryOneOnOne;

public interface ServiceCenterService {

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

}

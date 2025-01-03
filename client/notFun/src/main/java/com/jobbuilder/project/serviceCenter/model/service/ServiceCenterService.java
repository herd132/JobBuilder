package com.jobbuilder.project.serviceCenter.model.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.jobbuilder.project.serviceCenter.model.dto.InquiryOneOnOne;

public interface ServiceCenterService {

	/** 유저 문의 글 작성
	 * @param images
	 * @param inquiry
	 * @return
	 */
	int inquiryInsert(List<MultipartFile> images, InquiryOneOnOne inquiry) throws Exception;

}

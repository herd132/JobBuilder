package com.jobbuilder.project.serviceCenter.model.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.jobbuilder.project.serviceCenter.model.dto.InquiryImage;
import com.jobbuilder.project.serviceCenter.model.dto.InquiryOneOnOne;

@Mapper
public interface ServiceCenterMapper {

	
	/** 문의글 작성
	 * @param inquiry
	 * @return
	 */
	int inquiryInsert(InquiryOneOnOne inquiry);
	
	/** 문의글 작성 후 이미지 저장
	 * @param uploadList
	 * @return
	 */
	int insertUploadList(List<InquiryImage> uploadList);

}

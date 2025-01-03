package com.jobbuilder.project.serviceCenter.model.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.session.RowBounds;

import com.jobbuilder.project.serviceCenter.model.dto.InquiryImage;
import com.jobbuilder.project.serviceCenter.model.dto.InquiryOneOnOne;

@Mapper
public interface ServiceCenterMapper {


	/** 문의사항 내역 수
	 * @param memberNo
	 * @param rowBounds
	 * @return
	 */
	int getInquiryListCount(int memberNo);

	/** 문의 사항 리스트 조회
	 * @param memberNo
	 * @return
	 */
	List<InquiryOneOnOne> selectInquiryList(int memberNo, RowBounds rowBounds);

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

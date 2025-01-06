package com.jobbuilder.project.serviceCenter.model.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.session.RowBounds;

import com.jobbuilder.project.serviceCenter.model.dto.InquiryImage;
import com.jobbuilder.project.serviceCenter.model.dto.InquiryOneOnOne;
import com.jobbuilder.project.serviceCenter.model.dto.ServiceCenter;

@Mapper
public interface ServiceCenterMapper {

	
	/** 고객센터 글 리스트 수
	 * @param typeNo
	 * @return
	 */
	int getListCount(int typeNo);
	

	/** 고객센터 글 리스트 조회
	 * @param typeNo
	 * @param rowBounds
	 * @return
	 */
	List<ServiceCenter> serviceCenterList(int typeNo, RowBounds rowBounds);
	
	
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

	/** 고객센터글 상세 조회 글
	 * @param map
	 * @return
	 */
	ServiceCenter selectOne(Map<String, Integer> map);


	/** 조회수 갱신
	 * @param serviceCenterNo
	 * @return
	 */
	int updateReadCount(int serviceCenterNo);







}

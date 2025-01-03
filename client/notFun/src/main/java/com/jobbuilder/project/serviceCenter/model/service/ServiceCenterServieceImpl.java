package com.jobbuilder.project.serviceCenter.model.service;

import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.RowBounds;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.jobbuilder.project.board.model.dto.Pagination;
import com.jobbuilder.project.common.util.Utility;
import com.jobbuilder.project.serviceCenter.model.dto.InquiryImage;
import com.jobbuilder.project.serviceCenter.model.dto.InquiryOneOnOne;
import com.jobbuilder.project.serviceCenter.model.mapper.ServiceCenterMapper;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@Transactional(rollbackFor = Exception.class)
public class ServiceCenterServieceImpl implements ServiceCenterService{
	
	@Autowired
	private ServiceCenterMapper mapper;
	
	@Value("${my.inquery.web-path}")
	private String webPath; // /images/board/

	@Value("${my.inquery.folder-path}")
	private String folderPath; // C:/uploadFiles/board
	
	// 문의 내역 리스트 조회
	@Override
	public Map<String, Object> selectInquiryList(int memberNo, int cp) {

		int listCount = mapper.getInquiryListCount(memberNo);
		
		Pagination pagination = new Pagination(cp, listCount, 15 ,5);
		
		int limit = pagination.getLimit();
		int offset = (cp - 1 ) * limit;
		RowBounds rowBounds = new RowBounds(offset, limit);
		
		List<InquiryOneOnOne> boardList = mapper.selectInquiryList(memberNo, rowBounds); 
		
		
		Map<String, Object> map = new HashMap<>();
		
		map.put("pagination", pagination);
		map.put("inquiryList", boardList);
		
		return map;
	}

	// 문의글 삽입
	@Override
	public int inquiryInsert(List<MultipartFile> images, InquiryOneOnOne inquiry) throws Exception{
		int result = mapper.inquiryInsert(inquiry);
		
		if(result == 0 ) {
			return 0;
		}
		
		int inquiryNo = inquiry.getInquiryNo();
		
		List<InquiryImage> uploadList = new ArrayList<>();
		
		if (images != null ) {
			
			for( int i = 0 ; i < images.size(); i++) {
				
				String originalName = images.get(i).getOriginalFilename();
				
				// 변경명
				String rename = Utility.fileRename(originalName);
				
				// 모든 값을 저장할 DTO 생성 (BoardImg - Builder 패턴 사용 )
				InquiryImage img = InquiryImage.builder()
						   		.inquiryImagePath(webPath)
							   .inquiryImageOriginalName(originalName)
							   .inquiryImageRename(rename)
							   .inquiryImageOrder(i)
							   .inquiryNo(inquiryNo)
							   .uploadFile(images.get(i))
							   .build();
				
				
				// 해당 BoardImg를 uploadList 추가
				uploadList.add(img);
			}
			
			if(uploadList.isEmpty()) {
				return result;
			}
			
	
			result = mapper.insertUploadList(uploadList);
			
	
			if(result == uploadList.size()) {
				// 서버에 파일 저장
				for( InquiryImage img : uploadList) {
					img.getUploadFile().transferTo(new File(folderPath + img.getInquiryImageRename()));
				}
					
			} else {
				// 삽입 실패 시 롤백
				throw new RuntimeException();
			}
		}
		return result;
	}
}

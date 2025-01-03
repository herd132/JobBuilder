package com.jobbuilder.project.serviceCenter.model.service;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

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

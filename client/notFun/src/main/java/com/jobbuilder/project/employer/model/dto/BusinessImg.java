package com.jobbuilder.project.employer.model.dto;

import org.springframework.web.multipart.MultipartFile;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BusinessImg {

	/* ***** BUSINESS_IMG TABLE ***** */
	private int businessImgNo;
	private String businessImgPath;
	private String businessImgOriginalName;
	private String businessImgRename;
	private String businessImgOrder;
	
	/* ***** 파일업로드 시 필요한 필드 ***** */
	private MultipartFile uploadFile;
}

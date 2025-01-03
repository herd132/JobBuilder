package com.jobbuilder.project.serviceCenter.model.dto;

import org.springframework.stereotype.Service;
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
public class InquiryImage {
	
	private int inquiryImageNo;
	private String inquiryImagePath;
	private String inquiryImageOriginalName;
	private String inquiryImageRename;
	private int inquiryImageOrder;
	private int inquiryNo;
	
	private MultipartFile uploadFile;
}

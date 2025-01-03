package com.jobbuilder.project.serviceCenter.model.dto;

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
public class InquiryOneOnOne {

	private int inquiryNo;
	private int inquiryMajorCategory;
	private int inquiryMinorCategory;
	private String inquiryTitle;
	private String inquiryContent;
	private String inquiryEnrollDate;
	private int inquiryStatus;
	private int MemberNo;
	
	// 조회시 카테고리명 담을 변수
	private String inquiryMajorCategoryName;
	private String inquiryMinorCategoryName;
	private String memberEmail;
}
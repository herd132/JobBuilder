package com.jobbuilder.project.resume.model.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class Resume {

	private int workerNo;
	private int gradeNo; 	// 학력
	private int workDateNo; 	// 근무기간
	private int payType; 	// 급여 형태
	private int inputPay; 	// 희망 급여
	
	/* ***** BUSINESS_WORKTYPE TABLE (사업장 업직종 해소용) ***** */
	private List<ResumeBusinessWorktype> ResumeBusinessWorktype;
	private String businessWorktype;
}

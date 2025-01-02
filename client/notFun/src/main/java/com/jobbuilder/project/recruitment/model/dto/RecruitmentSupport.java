package com.jobbuilder.project.recruitment.model.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class RecruitmentSupport {
	
	/* ***** RECRUITMENT_SUPPORT ***** */
	private int recruitmentSupportNo;
	private String SupportNo;
	private int recruitmentNo;
	
	/* ***** SUPPORT ***** */
	private String supportCategory;

}

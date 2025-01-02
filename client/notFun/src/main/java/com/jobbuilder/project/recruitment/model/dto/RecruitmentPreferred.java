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
public class RecruitmentPreferred {

	/* ***** RECRUITMENT_PREFERRED ***** */
	private int recruitmentPreferredNo;
	private int recruitmentNo;
	private String preferredNo;
	
	/* ***** PREFERRED ***** */
	private String preferredCategory;
}

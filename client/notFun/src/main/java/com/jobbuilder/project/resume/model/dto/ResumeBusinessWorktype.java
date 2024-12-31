package com.jobbuilder.project.resume.model.dto;

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
public class ResumeBusinessWorktype {

	/* ***** BUSINESS_WORKTYPE ***** */
	private int businessWorktypeNo;
	private String worktypeNo;
	
	/* ***** EMPLOYER_WORKTYPE ***** */
	private String worktypeCategory; 
}

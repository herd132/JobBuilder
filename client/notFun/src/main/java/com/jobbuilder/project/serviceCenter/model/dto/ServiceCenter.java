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
public class ServiceCenter {

	private int serviceCenterNo;
	private String serviceCenterTitle;
	private String serviceCenterContent;
	private String serviceCenterWriteDate;
	private String serviceCenterUpdateDate;
	private int serviceCenterReadCount;
	private char serviceCenterDelFl;
	private int serviceCenterCode;
	
}

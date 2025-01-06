package com.jobbuilder.project.recruitment.model.dto;

import com.jobbuilder.project.resume.model.dto.CareerInfo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class JobType {
	private int jobTypeNo;
	private String jobTypeName;
}

package com.jobbuilder.project.resume.model.dto;

import java.util.List;
import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CareerInfo {

	private int careerNo;		// 경력사항고유번호
	private String companyName;	// 회사명
	private String startDate;	// 근무시작일
	private String endDate;		// 근무종료일
	private String careerDescription;	// 업무내용
	private int workerNo;	// 근로자고유식별번호
	
}
                                                      
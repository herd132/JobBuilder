package com.jobbuilder.project.resume.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ResumeAddress {
	private int resumeNo; // 이력서번호
	private int workcondAddressTypeNo; // 희망지역 고유번호
	private String workcondAddressTypeInfo; // 근무지 카테고리명 (JOIN용)
}




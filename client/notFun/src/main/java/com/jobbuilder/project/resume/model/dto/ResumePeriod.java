package com.jobbuilder.project.resume.model.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ResumePeriod {
	private int resumeNo; // 이력서번호
	private int periodNo; // 기간고유식별번호
	private String periodName; // 기간명 (JOIN용)
}

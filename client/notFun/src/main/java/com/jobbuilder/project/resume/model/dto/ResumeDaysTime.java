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
public class ResumeDaysTime {
	private int resumeNo; // 이력서번호
	private int daysNo; // 요일고유식별번호
	private int timeNo; // 시간고유식별번호
	private String daysName; // 요일명 
	private String timeName; // 시간명
}

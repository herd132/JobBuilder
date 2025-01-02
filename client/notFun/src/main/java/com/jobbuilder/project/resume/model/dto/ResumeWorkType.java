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
public class ResumeWorkType {
	private int resumeNo; // 이력서번호
	private int workTypeNo; // 업직종고유번호
	private String workTypeCategory; // 업직종카테고리명 (JOIN용)
}

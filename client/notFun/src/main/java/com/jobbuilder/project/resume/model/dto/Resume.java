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
public class Resume {

	private int resumeNo; // 이력서고유식별번호
	private int workerNo; // 근로자고유식별번호
	private String resumeTitle; // 제목
	private String resumeContent; // 자기소개내용
	private int gradeNo;  // 학력
	private int periodNo; // 근무기간
	private int salaryNo; 	// 급여 형태
	private int salaryAmount; 	// 희망 급여
	private String registrationDate; // 작성일
	private String modificationDate; // 수정일
	private String resumeDelFl; // 삭제여부(Y/N)
	
	private List<String> resumeJobTypeList; // 희망근무형태List
	private List<CareerInfo> resumeCareerInfoList; // 희망경력사항List
	private List<ResumeWorkType> resumeWorkTypeList; // 희망업직종List
	private List<ResumePeriod> resumePeriodList; // 희망근무기간List
	private List<ResumeDaysTime> resumeDaysTimeList; // 희망근무요일시간List
	
	
}

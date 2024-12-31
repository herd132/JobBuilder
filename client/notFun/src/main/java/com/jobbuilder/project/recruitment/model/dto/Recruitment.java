package com.jobbuilder.project.recruitment.model.dto;

import java.util.List;

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
public class Recruitment {

	/* ***** RECRUITMENT TABLE ***** */
	private int recruitmentNo;				// 공고번호(PK)
	private String recruitmentTitle;		// 채용공고 제목
	private String recruitmentContent;		// 채용공고 상세요강
	private String recruitmentDeadline;		// 공고마감일
	private int workcondJobtype;			// 1(알바)/ 2(정규직)
	private String numOfRecruitmentName;	// 인원미정/ 0명/ 00명
	private int salaryNo;					// 급여조건 번호(FK)
	private int gradeNo;					// 학력 번호(FK)
	private int periodNo;					// 근무기간 번호(FK)
	private int daysNo;						// 근무요일 번호(FK) 
	private int timeNo;						// 근무시간 번호(FK)
	private int employerNo;					// 고용주 번호(FK)
	private int salaryMount;				// 급여수준(ex 시급 : 10300, 월급 : 3000000)
	
	/* ***** FK 해소 TABLE ***** */
	private String salaryName;				// RECRUITMENT_SALARY
	private String gradeName;				// GRADE
	private String periodName;				// WORKCOND_PERIOD
	private String daysName;				// WORKCOND_DAYS
	private String timeName;				// WORKCOND_TIME
	
	private List<RecruitmentPreferred> preferredList;	// 우대사항 테이블 DTO List
	private List<RecruitmentSupport> supportList;		// 복리후생 테이블 DTO List
	private List<RecruitmentImg> imageList;				// 사업장 이미지 테이블 관련 DTO List
	
	
}

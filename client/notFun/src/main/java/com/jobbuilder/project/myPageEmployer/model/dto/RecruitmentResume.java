package com.jobbuilder.project.myPageEmployer.model.dto;

import java.util.List;

import com.jobbuilder.project.employer.model.dto.BusinessWorktype;
import com.jobbuilder.project.resume.model.dto.ResumeDaysTime;
import com.jobbuilder.project.resume.model.dto.ResumeWorkType;

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
public class RecruitmentResume {
	
	private int memberNo;							// 회원번호

	private int recruitmentNo;						// 공고번호
	private String recruitmentTitle;					// 공고제목(*)
	private String businessNickname;				// 사업장 지점명(*)
	private int employerNo;							// 사업장 번호(전화번호 아님)
	private String gradeName;						// 요구학력
	private String periodName;						// 근무기간 (*)
	private String daysName;						// 근무요일
	private String timeName;						// 근무시간
	private String workcondAddressTypeInfo;			// 근무지역 (*)
	private List<BusinessWorktype> worktypeList;	// 사업장 업직종 리스트
	
	private int resumeNo;							// 이력서 번호
	private String resumeTitle;						// 이력서 제목(*)
	private String caarerFl;						// 경력여부(*) count만 해서 1이상이면 경력
	private String hopePeriodName;					// 희망 근무기간 (*)
	private String resumeContent;					// 이력서 내용
	private List<ResumeWorkType> resumeWorkTypeList;// 희망 업직종 리스트
	private List<ResumeDaysTime> resumeDaysTimeList;// 희망 요일시간 리스트
}







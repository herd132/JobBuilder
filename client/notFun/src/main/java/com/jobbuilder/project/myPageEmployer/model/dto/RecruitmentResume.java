package com.jobbuilder.project.myPageEmployer.model.dto;

import java.util.List;

import com.jobbuilder.project.employer.model.dto.BusinessWorktype;
import com.jobbuilder.project.resume.model.dto.CareerInfo;
import com.jobbuilder.project.resume.model.dto.ResumeAddress;
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

	private int recruitmentNo;						// 공고번호
	private int employerNo;							// 사업장 번호(전화번호 아님)
	private String recruitmentTitle;				// 공고제목(*)
	private String businessNickname;				// 사업장 지점명(*)
	private String businessTel;						// 사업장 전화번호
	private List<BusinessWorktype> worktypeList;	// 사업장 업직종 리스트
	
	private String jobtypeName;						// 고용 형태(알바, 정규직, 기간계약직)
	private String salaryName;						// 급여형태(시급, 월급, 추후협의)
	private int salaryMount;						// 급여액
	private String periodName;						// 근무기간 (*)
	private String gradeName;						// 요구학력
	private String daysName;						// 근무요일
	private String timeName;						// 근무시간
	private String workcondAddressTypeInfo;			// 근무지역 (*)
	
	private String recruitReadFl;					// 읽음 여부(Y/N)
	
	private int resumeNo;							// 이력서 번호
	private int workerNo;							// 알바생 번호
	private String workerMbti;						// 알바생 MBTI
	private String workerAddress;					// 알바생 주소
	private String memberTel;						// 알바생 전화번호
	private String memberEmail;						// 알바생 이메일
	private String resumeTitle;						// 이력서 제목(*)
	private String careerFl;						// 경력여부(*), 경력/신입
	
	private List<String> resumeJobtypeList;			// 희망 고용 형태
	private String hopeSalaryName;					// 알바생 희망 급여형태
	private int hopeSalaryAmount;					// 알바생 희망 급여액
	private String hopePeriodName;					// 희망 근무기간 (*)
	private String workerGradeName;					// 알바생 학력
	private List<ResumeDaysTime> hopeDaysTimeList;	// 희망 요일시간 리스트
	private List<ResumeAddress> hopeAddressList;	// 희망 근무지역 리스트
	private List<ResumeWorkType> hopeWorkTypeList;	// 희망 업직종 리스트
	private String resumeContent;					// 이력서 내용
	private List<CareerInfo> careerInfoList;		// 경력사항

}







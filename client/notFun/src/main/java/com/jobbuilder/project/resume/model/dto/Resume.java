package com.jobbuilder.project.resume.model.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@Builder
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
	private String resumeHideFl; // 공개여부(Y/N)
	
	private List<String> resumeJobTypeList; // 희망근무형태List
	private List<CareerInfo> resumeCareerInfoList; // 희망경력사항List
	private List<ResumeWorkType> resumeWorkTypeList; // 희망업직종List
	private List<ResumePeriod> resumePeriodList; // 희망근무기간List
	private List<ResumeDaysTime> resumeDaysTimeList; // 희망근무요일시간List
	

    private int workcondAddressNo; // 해소테이블 주소구분번호
    private String workcondAddressTypeNo;  // 희망주소코드 0100 등
    private String workcondAddressTypeInfo;// 희망주소명 서울 등
    
    
    private int totalCareer; // 총경력 (셀렉용)
    private int updateType;
    private String value;
    
    private int recommendation; // 추천알바건수
    
    //private Worker worker;
    //private Member member;
	
    
    private String profileImg;
    private String memberEmail;		// 회원이메일
    private String memberName;		// 회원 이름
	private String memberTel;			// 회원 전화번호 (비밀번호 찾기용)
	private String workerMbti;		// 알바생 MBTI
	private String workerBirthDate; // 알바생 생년월일
	private String workerAddress;	// 알바생 주소
	private int age;
    
}

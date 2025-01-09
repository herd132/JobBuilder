package com.jobbuilder.project.refined.model.dto;

import java.util.List;

import com.jobbuilder.project.employer.model.dto.BusinessWorktype;
import com.jobbuilder.project.recruitment.model.dto.RecruitmentPreferred;
import com.jobbuilder.project.recruitment.model.dto.RecruitmentSupport;
import com.jobbuilder.project.resume.model.dto.CareerInfo;
import com.jobbuilder.project.resume.model.dto.ResumeDaysTime;
import com.jobbuilder.project.resume.model.dto.ResumePeriod;
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
public class Refined {
	
	private int recruitmentNo;				// 공고번호(PK)
	private String recruitmentTitle;		// 채용공고 제목
	private String recruitmentContent;		// 채용공고 상세요강
	private String recruitmentDeadline;		// 공고마감일
	private int jobtypeNo;					// 알바형태(FK) 1(알바)/ 2(정규직)
	private String numOfRecruitmentName;	// 인원미정/ 0명/ 00명
	private int salaryNo;					// 급여조건 번호(FK)
	private int gradeNo;					// 학력 번호(FK)
	private int periodNo;					// 근무기간 번호(FK)
	private int daysNo;						// 근무요일 번호(FK) 
	private int timeNo;						// 근무시간 번호(FK)
	private int employerNo;					// 고용주 번호(FK)
	private int salaryMount;				// 급여수준(ex 시급 : 10300, 월급 : 3000000)
	// 새로 추가한 컬럼(250101~)
	private String writeDate;				// 공고글 작성날짜
	private String updateDate;				// 공고글 수정날짜
	private String recruitmentDelFl;		// 공고글 삭제여부(Y/N)
	private int memberNo;					// 회원번호(FK)
	private String recruitCompleteFl;		// 구인 완료여부(FK)
	private String recruitmentProfile;		// 공고 이미지(선택사항)
	private String workcondAddressTypeNo;	// 근무지역번호
	
	/* ***** FK 관련 TABLE ***** */
	private String jobtypeName;				// JOBTYPE, 근무형태
	private String salaryName;				// RECRUITMENT_SALARY, 시급/월급 
	private String gradeName;				// GRADE, 학력
	private String periodName;				// WORKCOND_PERIOD, 근무 기간
	private String daysName;				// WORKCOND_DAYS, 근무 요일
	private String timeName;				// WORKCOND_TIME, 근무 시간
	private String businessNickname;		// 지점명
	// 새로 추가한 컬럼(250101~)
	private String businessName;			// 회사명
	private String businessAddress;			// 지점명주소
	private String thumbnail;				// 대표이미지(경로 저장용)
	private String workcondAddressTypeInfo;	// 근무지역명
	
	private List<BusinessWorktype> businessWorktypeList;// 업직종 테이블 DTO List
	private List<RecruitmentPreferred> preferredList;	// 우대사항 테이블 DTO List
	private List<RecruitmentSupport> supportList;		// 복리후생 테이블 DTO List
	
	private int resumeNo;				// 이력서고유식별번호
	private String resumeTitle;			// 제목
	private String resumeContent;		// 자기소개내용
	private int workerNo;				// 근로자고유식별번호
	private int salaryAmount; 			// 희망 급여
	private String registrationDate;	// 작성일
	private String modificationDate;	// 수정일
	private String resumeDelFl; 		// 삭제여부(Y/N)
	private String resumeHideFl; 		// 공개여부(Y/N)
	
	
	private List<String> resumeJobTypeList; // 희망근무형태List
	private List<CareerInfo> resumeCareerInfoList; // 희망경력사항List
	private List<ResumeWorkType> resumeWorkTypeList; // 희망업직종List
	private List<ResumePeriod> resumePeriodList; // 희망근무기간List
	private List<ResumeDaysTime> resumeDaysTimeList; // 희망근무요일시간List

    private int workcondAddressNo; // 해소테이블 주소구분번호

    private int totalCareer; // 총경력 (셀렉용)
    private int updateType;
    private String value;
    
    private int recommendation; // 추천알바건수
   
	
	private String carrerStr;

    private String profileImg;
    private String memberEmail;		// 회원이메일
    private String memberName;		// 회원 이름
	private String memberTel;			// 회원 전화번호 (비밀번호 찾기용)
	private String workerMbti;		// 알바생 MBTI
	private String workerBirthDate; // 알바생 생년월일
	private String workerAddress;	// 알바생 주소
	private int age;

    
}

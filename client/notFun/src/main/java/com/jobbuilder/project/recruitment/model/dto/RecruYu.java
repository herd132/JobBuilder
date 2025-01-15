package com.jobbuilder.project.recruitment.model.dto;

import java.util.List;

import com.jobbuilder.project.employer.model.dto.BusinessWorktype;

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
public class RecruYu {
	/* ***** RECRUITMENT TABLE ***** */
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
	private String workcondAddressTypeNo;	// 근무지역번호
	
	/* ***** FK 관련 TABLE ***** */
	private String businessNickname;		// 지점명
	// 새로 추가한 컬럼(250101~)
	private String businessName;			// 회사명
	private String businessAddress;			// 지점명주소
	private String thumbnail;				// 대표이미지(경로 저장용)
	private String workcondAddressTypeInfo;	// 근무지역명
	private String memberName;				// 사업자명
	private String enrollDate;				// 등록일
	private String memberTel;				// 대표자전화번호
	
	private List<BusinessWorktype> businessWorktypeList;// 업직종 테이블 DTO List
	private List<RecruitmentPreferred> preferredList;	// 우대사항 테이블 DTO List
	private List<RecruitmentSupport> supportList;		// 복리후생 테이블 DTO List
	
}

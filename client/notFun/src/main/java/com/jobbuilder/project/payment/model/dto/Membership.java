package com.jobbuilder.project.payment.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Membership {
	private int membershipNo;					// 맴버십 번호
	private int membershipType;					// 맴버 등급
	private String membershipContent;			// 혜택 내용
	private String membershipDelFl;				// 가입여부 확인
	private String membershipStartDate;			// 가입일
	private String membershipEndDate;			// 탈퇴일(종료일자)
	private String membershipExpirationDate;	// 잔여일 기준점
	private String membershipSubscriptionFl;	// 구독 결제 여부 Y/N
	
	private int employerNo; 					// 고용주 번호 (연동자료)
	private int memberNo;						// 회원 번호 (연동자료)
	
    private int remainingDays;					// 잔여일 (셀렉자료)
    
    private String membershipName;				// 맴버 등급 이름변환 (해소테이블)
    private String membershipExpense;			// 맴버 등급 비용 (해소테이블)


}

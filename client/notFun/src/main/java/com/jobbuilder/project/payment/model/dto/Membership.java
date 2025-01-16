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
	private String membershipStartDate;			// 가입일
	private String membershipEndDate;			// 탈퇴일(종료일자)
	private String membershipDelFl;				// 탈퇴 여부 확인
	private String membershipBuyDate;			// 구매날짜
	
	private int employerNo; 					// 고용주 번호 (연동자료)
	private int memberNo;						// 회원 번호 (연동자료)
	
	private int membershipDateValue;			// 탈퇴일 계산 도우미1 (인설트자료)
	private String durationUnit; 				// 탈퇴일 계산 도우미2 (인설트자료)
	
    private int remainingDays;					// 잔여일 (셀렉자료)
    
    private String membershipName;				// 맴버 등급 이름변환 (해소테이블)
    
    private Integer emptyMembershipCount;
    
    private String membershipProduct;		// 상세 정보용 상품명 (해소 테이블)
    private int membershipAmount;
    
    private int paymentTypeNo;          // 상세 결제 번호
    private int paymentNo;              // 결제 번호 (연동)

    private String businessName;
    
}

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
	private String membershipType;				// 맴버 등급
	private String membershipContent;			// 혜택 내용
	private String membershipDelFl;				// 가입여부 확인
	private String membershipStartDate;			// 가입일
	private String membershipEndDate;			// 탈퇴일(종료일자)
	private String membershipExpirationDate;	// 잔여일 기준점
	private String membershipSubscriptionFl;	// 구독 결제 여부 Y/N
	
	private int employerNo; 					// 고용주 번호 (연동자료)
	private int memberNo;						// 회원 번호 (연동자료)
	
    private String remainingDays;

    // Getter and Setter
    public Integer getEmployerNo() {
        return employerNo;
    }

    public void setEmployerNo(Integer employerNo) {
        this.employerNo = employerNo;
    }

    public String getMembershipType() {
        return membershipType;
    }

    public void setMembershipType(String membershipType) {
        this.membershipType = membershipType;
    }

    public String getMembershipContent() {
        return membershipContent;
    }

    public void setMembershipContent(String membershipContent) {
        this.membershipContent = membershipContent;
    }

    public String getRemainingDays() {
        return remainingDays;
    }

    public void setRemainingDays(String remainingDays) {
        this.remainingDays = remainingDays;
    }
}

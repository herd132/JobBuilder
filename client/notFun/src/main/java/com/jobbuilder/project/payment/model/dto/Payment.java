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
public class Payment {
	private int paymentNo;					// 결제 번호
	private String paymentDate;				// 결제 일
	private int paymentAmount;				// 결제 금액
	private String paymentStatus;			// 결제 상태
	private String paymentBankTitle;		// 매출을 관리하는 은행명 (총관리인 명의)
	private String paymentBankAaccount;		// 매출을 관리하는 은행계좌 (총관리인 명의)
	
	private int membershipNo;				// 맴버쉽 번호 (연동정보)
	private int employerNo;					// 고용주번호 (연동정보)
	
	private int paymentTypeNo;				// 결제수단 번호
	private String paymentTypeFirst;		// 결제방법1 (은행,카드등 타이틀 정보)
	private String paymentTypeSecond;		// 결제방법2 (위 정보의 계좌번호,카드번호등)
	private String paymentTypeFavFl;		// 자주 쓰는 계좌 등록 여부 Y/N
	private String paymentTypeRefundFl;		// 환불 계좌 등록 여부 Y/N
}


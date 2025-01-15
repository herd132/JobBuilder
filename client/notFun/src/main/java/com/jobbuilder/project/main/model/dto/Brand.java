package com.jobbuilder.project.main.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Brand {
	private int employerNo;
	private String businessName;
	private String businessNickname;
	private int totalPayment;
	private String latestPaymentDate;
	private int paymentRank;
	private String businessImgUrl;
	
	// 
}

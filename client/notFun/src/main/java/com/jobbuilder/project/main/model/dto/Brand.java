package com.jobbuilder.project.main.model.dto;

import java.text.NumberFormat;
import java.util.Locale;

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

	// 플래티넘 공고용
	private int recruitmentNo;
	private String recruitmentTitle;
	private String workcondAddressTypeInfo;
	private String salaryName;
	private int salaryMount;
	private String formatSalaryMount; // 원화단위로 포맷팅


}

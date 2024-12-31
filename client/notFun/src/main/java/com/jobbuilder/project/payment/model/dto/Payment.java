package com.jobbuilder.project.payment.model.dto;

import java.util.List;

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
	private String paymentProduct;		    // 상품명
	private int paymentAmount;				// 결제 금액
	private String paymentStatus;			// 결제 상태
	private String merchantUid;		// 매출을 관리하는 은행명 (총관리인 명의)
	private String impUid;		// 매출을 관리하는 은행계좌 (총관리인 명의)
	
	private int membershipNo;				// 맴버쉽 번호 (연동정보)
	private int employerNo;					// 고용주번호 (연동정보)
	
	private int paymentCrossNo;				// 해소 테이블 번호 (연동자료)
	
	
	private List<PaymentType> paymentDetails;
	
	
	
    public String getPaymentProduct() {
        return paymentProduct;
    }

    public void setPaymentProduct(String paymentProduct) {
        this.paymentProduct = paymentProduct;
    }
	
    private List<Integer> membershipNumbers;

    public List<Integer> getMembershipNumbers() {
        return membershipNumbers;
    }

    public void setMembershipNumbers(List<Integer> membershipNumbers) {
        this.membershipNumbers = membershipNumbers;
    }
    
    
}


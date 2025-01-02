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
    private int paymentNo;                  // 결제 번호
    private String paymentDate;             // 결제 일
    private String paymentProduct;          // 상품명
    private int paymentAmount;              // 결제 금액
    private String paymentStatus;           // 결제 상태
    private String merchantUid;             // 거래번호
    private String impUid;                  // 주문번호

    private int membershipNo;               // 맴버십 번호 (연동정보)
    private int employerNo;                 // 고용주번호 (연동정보)

    private int paymentCrossNo;             // 해소 테이블 번호 (연동자료)

    private List<PaymentType> paymentDetails;

    private int membershipDateValue;        // 탈퇴일 계산 도우미1 (인설트자료)
    private String durationUnit;            // 탈퇴일 계산 도우미2 (인설트자료)

    private Integer emptyMembershipCount;   // 신규맴버십 카운트용 (인설트자료)

    
}

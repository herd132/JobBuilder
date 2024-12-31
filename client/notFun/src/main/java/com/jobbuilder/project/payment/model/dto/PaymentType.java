package com.jobbuilder.project.payment.model.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class PaymentType {
    private int paymentTypeNo;          // 상세 결제 번호
    private int paymentNo;              // 결제 번호 (연동)
    private String paymentTypeProduct;  // 상세 상품명
    private int paymentTypeAmount;      // 상세 결제 금액
}

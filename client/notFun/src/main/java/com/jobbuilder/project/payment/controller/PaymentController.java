package com.jobbuilder.project.payment.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.SessionAttribute;

import com.jobbuilder.project.employer.model.dto.Employer;
import com.jobbuilder.project.payment.model.dto.Membership;
import com.jobbuilder.project.payment.model.dto.Payment;
import com.jobbuilder.project.payment.model.service.PaymentService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Controller
@RequestMapping("payments")
@RequiredArgsConstructor
@Slf4j
public class PaymentController {

	@Autowired
    private final PaymentService service;
	

    // 기본 페이지
    @GetMapping("")
    public String showPaymentsPage() {
        return "payments/payments";
    }
    
    @GetMapping("testpay")
    public String showTestPage() {
        return "payments/testpay";
    }
    
    @GetMapping("test3")
    public String showTestPage3() {
        return "payments/test3";
    }
    

    @PostMapping("/details")
    @ResponseBody
    public Map<String, Object> getMembershipDetails(@SessionAttribute("loginEmployer") Employer loginEmployer) {
        Map<String, Object> response = new HashMap<>();
        List<Membership> membershipDetails = service.getMembershipDetails(loginEmployer.getEmployerNo());
        response.put("membershipDetails", membershipDetails);
        return response;
    }
    
    @PostMapping("/complete")
    public ResponseEntity<Map<String, Object>> completePayment(@RequestBody Map<String, Object> paymentData) {
        log.info("Received payment data: {}", paymentData);

        try {
            String impUid = (String) paymentData.get("imp_uid");
            String merchantUid = (String) paymentData.get("merchantUid"); // 키 변경 확인
            int amount = (int) paymentData.get("amount");
            List<Integer> membershipNumbers = (List<Integer>) paymentData.get("membershipNumbers");
            int employerNo = (int) paymentData.get("employerNo");
            String paymentProduct = (String) paymentData.get("paymentProduct");

            Payment payment = Payment.builder()
                    .impUid(impUid)
                    .merchantUid(merchantUid) // 설정
                    .paymentAmount(amount)
                    .paymentStatus("승인")
                    .employerNo(employerNo)
                    .paymentProduct(paymentProduct)
                    .build();

            service.savePayment(payment, membershipNumbers);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "결제가 성공적으로 완료되었습니다.");
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Error processing payment: {}", e.getMessage(), e);
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "결제 처리 중 오류가 발생했습니다.");
            return ResponseEntity.status(500).body(response);
        }
    }







    




    
    
}

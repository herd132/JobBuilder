package com.jobbuilder.project.payment.controller;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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

import jakarta.servlet.http.HttpSession;
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
    @GetMapping("membership")
    public String showPaymentsPage() {
    	return "/payments/membership";
    }
    
    @GetMapping("/data")
    public ResponseEntity<?> fetchEmployerData(HttpSession session) {
    	
        Employer loginEmployer = (Employer) session.getAttribute("loginEmployer");

        if (loginEmployer == null) {
            return ResponseEntity.ok(Collections.emptyList()); // 빈 리스트 반환
        }
        // 데이터 조회
        List<Employer> result = service.getEmployerNo(loginEmployer.getMemberNo());
        if (result == null || result.isEmpty() || loginEmployer == null) {
            // 데이터가 없으면 HTTP 404 상태 반환
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No data found");
        }

        // 정상적으로 JSON 데이터 반환
        return ResponseEntity.ok(result);
    }

    
    
    @GetMapping("testpay")
    public String showTestPage() {
        return "payments/testpay";
    }
    
    @GetMapping("testpay2")
    public String showTestPage2() {
        return "payments/testpay2";
    }
    
    @GetMapping("test3")
    public String showTestPage3() {
        return "payments/test3";
    }
    
    @PostMapping("/paymentlist")
    @ResponseBody
    public Map<String, Object> getPaymentList(@SessionAttribute("loginEmployer") Employer loginEmployer,
    		@RequestBody int employerNo) {
    	log.debug("employerNo :"+ employerNo);
        Map<String, Object> response = new HashMap<>();
        try {
            List<Payment> paymentList = service.getPaymentList(employerNo);
            response.put("paymentList", paymentList);
        } catch (Exception e) {
            e.printStackTrace();  // 로그에 오류를 출력
            response.put("error", "서버 오류가 발생했습니다.");
        }
        return response;
    }

   
    
    
 
    // 맴버십 정보 받아오기
    @PostMapping("/details")
    @ResponseBody
    public Map<String, Object> getMembershipDetails(@RequestBody Map<String, Integer> request) {
        Integer employerNo = request.get("employerNo");
        Map<String, Object> response = new HashMap<>();
        try {
            // employerNo를 기반으로 맴버십 상세 정보 가져오기
            List<Membership> membershipDetails = service.getMembershipDetails(employerNo);
            response.put("membershipDetails", membershipDetails);
        } catch (Exception e) {
            e.printStackTrace();
            response.put("error", "맴버십 정보를 가져오는 중 오류가 발생했습니다.");
        }
        return response;
    }
    
    // 결제 완료후
    @PostMapping("/complete")
    public ResponseEntity<Map<String, Object>> completePayment(@RequestBody Map<String, Object> paymentData) {
        try {
        	 log.debug("Received paymentData: {}", paymentData);
            // 입력값 매핑
            String impUid = (String) paymentData.get("imp_uid"); // 결제번호
            String merchantUid = (String) paymentData.get("merchantUid"); // 주문번호
            int amount = (int) paymentData.get("amount"); // 결제금액 
            List<Integer> validMembershipNumbers = (List<Integer>) paymentData.get("validMembershipNumbers"); // 선택한 상품의 맴버십번호 (기존 상품 구분용)
            int emptyMembershipCount = (int) paymentData.get("emptyMembershipCount"); // 빈 슬롯 카운트 (신규를 의미)
            List<Map<String, Object>> memberships = (List<Map<String, Object>>) paymentData.get("memberships"); // 유저가 선택한 상품 배열
            int employerNo = (int) paymentData.get("employerNo"); // 사업주 회원번호
            String paymentProduct = (String) paymentData.get("paymentProduct"); // 결제한 상품명

            // DTO 변환
            List<Membership> membershipList = memberships.stream() // DTO로 변환
            	    .map(detail -> Membership.builder()
            	        .membershipType((int) detail.get("membershipType"))
            	        .membershipDateValue((int) detail.get("membershipDateValue"))
            	        .durationUnit((String) detail.get("durationUnit"))
            	        .membershipAmount((int) detail.get("membershipAmount")) 
            	        .membershipProduct((String) detail.get("membershipProduct"))
            	        .employerNo(employerNo)
            	        .build())
            	    .collect(Collectors.toList());


            // Payment 객체 생성
            Payment payment = Payment.builder()
                    .impUid(impUid)
                    .merchantUid(merchantUid)
                    .paymentAmount(amount)
                    .paymentStatus("승인")
                    .employerNo(employerNo)
                    .paymentProduct(paymentProduct)
                    .build();

            // 서비스 호출
            service.savePayment(payment, validMembershipNumbers, emptyMembershipCount, membershipList); // 빈 슬롯을 카운트로 대체

            // 성공 응답
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "결제가 성공적으로 완료되었습니다.");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            // 오류 처리
            log.error("Error processing payment: {}", e.getMessage(), e);
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "결제 처리 중 오류가 발생했습니다.");
            return ResponseEntity.status(500).body(response);
        }
    }












    




    
    
}

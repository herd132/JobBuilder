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

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
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
    @GetMapping("")
    public String showPaymentsPage() {
    	return "payments/payments";
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

    @GetMapping("history")
    public String showhistory() {
        return "payments/history";
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

    
    @PostMapping("/refund")
    @ResponseBody
    public String getPaymentList(@RequestBody int paymentNo) {

        try {
            // 서비스 호출: 단일 문자열 반환
            String refundMessage = service.getRefundMessage(paymentNo);

            // 반환된 문자열을 그대로 리스폰스에 전달
            return refundMessage;
        } catch (Exception e) {
            e.printStackTrace(); // 오류 로그 출력
            return "서버 오류가 발생했습니다.";
        }
    }

    @PostMapping("/confirmRefund")
    @ResponseBody
    public String confirmRefund(@RequestBody int paymentNo) {

        try {
            // 서비스 호출: 단일 문자열 반환
            String confirmRefund = service.confirmRefund(paymentNo);

            // 반환된 문자열을 그대로 리스폰스에 전달
            return confirmRefund;
        } catch (Exception e) {
            e.printStackTrace(); // 오류 로그 출력
            return "서버 오류가 발생했습니다.";
        }
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
    public ResponseEntity<?> completePayment(@RequestBody Map<String, Object> paymentData) {
        try {
            // 1. 요청 데이터 파싱
            String impUid = (String) paymentData.get("imp_uid");
            String merchantUid = (String) paymentData.get("merchantUid");
            int amount = (int) paymentData.get("amount");
            int employerNo = (int) paymentData.get("employerNo"); // 사업주 회원번호

            // 2. 결제 검증 서비스 호출
            boolean isVerified = service.verifyPayment(impUid, merchantUid, amount, employerNo);

 
            if (isVerified) {
                // 3. 기존 결제 완료 로직 실행
                String customDataJson = (String) paymentData.get("customData");
                // TypeReference의 익명 클래스를 사용하여 JSON을 Map으로 변환
                Map<String, Object> customData = new ObjectMapper().readValue(customDataJson, new TypeReference<Map<String, Object>>() {});

                List<Map<String, Object>> newMemberships = (List<Map<String, Object>>) customData.get("newMemberships");
                List<Map<String, Object>> oldMemberships = (List<Map<String, Object>>) customData.get("oldMemberships");
                List<Integer> validMembershipNumbers = (List<Integer>) customData.get("validMembershipNumbers");
                int emptyMembershipCount = (int) customData.get("emptyMembershipCount");
                String paymentProduct = (String) paymentData.get("paymentProduct");

                List<Membership> newMembershipList = newMemberships.stream()
                    .map(detail -> Membership.builder()
                        .membershipType((int) detail.get("membershipType"))
                        .membershipDateValue((int) detail.get("membershipDateValue"))
                        .durationUnit((String) detail.get("durationUnit"))
                        .membershipAmount((int) detail.get("membershipAmount"))
                        .membershipProduct((String) detail.get("membershipProduct"))
                        .employerNo(employerNo)
                        .build())
                    .collect(Collectors.toList());

                List<Membership> oldMembershipList = oldMemberships.stream()
                    .map(detail -> Membership.builder()
                        .membershipType((int) detail.get("membershipType"))
                        .membershipDateValue((int) detail.get("membershipDateValue"))
                        .durationUnit((String) detail.get("durationUnit"))
                        .membershipAmount((int) detail.get("membershipAmount"))
                        .membershipProduct((String) detail.get("membershipProduct"))
                        .employerNo(employerNo)
                        .build())
                    .collect(Collectors.toList());

                Payment payment = Payment.builder()
                    .impUid(impUid)
                    .merchantUid(merchantUid)
                    .paymentAmount(amount)
                    .paymentStatus("승인")
                    .employerNo(employerNo)
                    .paymentProduct(paymentProduct)
                    .build();

                service.savePayment(payment, validMembershipNumbers, emptyMembershipCount, oldMembershipList, newMembershipList);

                // 성공 응답 반환
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("message", "결제가 성공적으로 완료되었습니다.");
                return ResponseEntity.ok(response);
            } else {
                // 검증 실패 처리
                return ResponseEntity.badRequest().body("결제 검증 실패");
            }
        } catch (Exception e) {
            // 예외 처리
            log.error("Error processing payment: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("결제 처리 중 오류 발생");
        }
    }













    




    
    
}

package com.jobbuilder.project.payment.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.jobbuilder.project.payment.model.service.PaymentService;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Controller
@RequestMapping("payments")
@RequiredArgsConstructor
@Slf4j
public class PaymentController {

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
    

    @PostMapping("/details")
    @ResponseBody
    public Map<String, Object> getMembershipDetails(HttpSession session) {
        Map<String, Object> response = new HashMap<>();

        Integer employerNo = (Integer) session.getAttribute("employerNo");
        response.put("membershipDetails", service.getMembershipDetails(employerNo));

        return response;
    }
    
}

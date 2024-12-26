package com.jobbuilder.project.payment.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.SessionAttribute;

import com.jobbuilder.project.employer.model.dto.Employer;
import com.jobbuilder.project.payment.model.dto.Membership;
import com.jobbuilder.project.payment.model.service.PaymentService;

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
    public Map<String, Object> getMembershipDetails(@SessionAttribute("loginEmployer") Employer loginEmployer) {
        Map<String, Object> response = new HashMap<>();
        List<Membership> membershipDetails = service.getMembershipDetails(loginEmployer.getEmployerNo());
        response.put("membershipDetails", membershipDetails);
        return response;
    }




    
    
}

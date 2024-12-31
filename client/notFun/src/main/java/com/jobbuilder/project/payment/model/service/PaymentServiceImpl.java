package com.jobbuilder.project.payment.model.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.jobbuilder.project.payment.model.dto.Membership;
import com.jobbuilder.project.payment.model.dto.Payment;
import com.jobbuilder.project.payment.model.mapper.PaymentMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
@Slf4j
public class PaymentServiceImpl implements PaymentService {

    private final PaymentMapper mapper;
    
    @Override
    public List<Membership> getMembershipDetails(int employerNo) {
        log.debug("Fetching membership details for employerNo: {}", employerNo);
        return mapper.selectMembershipDetails(employerNo);
    }
    
    @Override
    public void savePayment(Payment payment, List<Integer> membershipNumbers) {
        if (membershipNumbers == null || membershipNumbers.isEmpty()) {
            log.info("Saving new payment: {}", payment);
            mapper.insertPayment(payment);
        } else {
            for (Integer membershipNo : membershipNumbers) {
                payment.setMembershipNo(membershipNo); // 멤버십 번호 설정
                log.info("Saving payment for membershipNo {}: {}", membershipNo, payment);
                mapper.insertPayment(payment);
            }
        }
    }

    
}





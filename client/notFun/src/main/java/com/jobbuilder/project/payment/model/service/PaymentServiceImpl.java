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
    public void savePayment(Payment payment, List<Integer> validMembershipNumbers, int emptyMembershipCount,
            List<Membership> membershipList) {
        // 1단계: 결제 정보 저장
        log.info("Saving payment: {}", payment);
        mapper.savePayment(payment); // paymentNo 설정

        boolean processed = false; // 처리 여부 플래그

        // 2단계: 기존 멤버십 연결
        if (validMembershipNumbers != null && !validMembershipNumbers.isEmpty()) {
            processed = true; // 처리 상태 기록
            for (Integer membershipNo : validMembershipNumbers) {
                log.info("Linking existing membershipNo {} to paymentNo {}: {}", membershipNo, payment.getPaymentNo(), payment);

                // 기존 멤버십 연결
                payment.setMembershipNo(membershipNo);
                mapper.connectionPayment(payment); // PAYMENT_MEMBERSHIP 연결
            }
        }

        // 3단계: 신규 멤버십 생성 및 연결
        if (emptyMembershipCount > 0) {
            processed = true; // 처리 상태 기록
            for (int i = 0; i < emptyMembershipCount; i++) {
                Membership membership = membershipList.get(i); // 신규 멤버십 정보 가져오기
                log.info("Creating new membership: {}", membership);

                // 신규 MEMBERSHIP 생성
                mapper.newMembership(membership);

                // 생성된 membershipNo와 결제 연결
                log.info("Linking new membershipNo {} to paymentNo {}: {}", membership.getMembershipNo(), payment.getPaymentNo());
                payment.setMembershipNo(membership.getMembershipNo());
                mapper.connectionPayment(payment); // PAYMENT_MEMBERSHIP 연결
            }
        }

        // 조건이 모두 충족되지 않았을 경우 예외를 던짐
        if (!processed) {
            throw new IllegalArgumentException("유효한 멤버십 번호도 없고 신규 멤버십 정보도 없습니다.");
        }

        log.info("Payment and membership linking completed for paymentNo: {}", payment.getPaymentNo());
    }



        
    
        
        
}






    






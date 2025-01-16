package com.jobbuilder.project.payment.model.service;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.jobbuilder.project.employer.model.dto.Employer;
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
	public List<Employer> getEmployerNo(int memberNo) {
		return mapper.getEmployerNo(memberNo);
	}
    
    @Override
    public List<Membership> getMembershipDetails(int employerNo) {
        log.debug("Fetching membership details for employerNo: {}", employerNo);
        return mapper.getMembershipDetails(employerNo);
    }
    
    @Override
    public List<Payment> getPaymentList(int employerNo) {
        log.debug("Fetching membership details for employerNo: {}", employerNo);
        return mapper.getPaymentList(employerNo);
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
            int i = 0; // 반복용 기준 초기화
            
            // 2-1단계: 기존맴버십일 경우 맴버십&결제 해소테이블의 정보를 담음
            for (Integer membershipNo : validMembershipNumbers) {
                log.info("Linking existing membershipNo {} to paymentNo {}: {}", membershipNo, payment.getPaymentNo(), payment);
                // 기존 멤버십 연결
                payment.setMembershipNo(membershipNo);
                mapper.connectionPayment(payment); // PAYMENT_MEMBERSHIP 연결      
            }
            
            // 2-2단계: 기존맴버십일 경우 결제 상세정보 테이블에 정보를 담음
         	for (i = 0; i < validMembershipNumbers.size(); i++) {
         		log.info("Linking2 paymentNo {}: {}", payment.getPaymentNo(), payment);
           	 Membership membership = membershipList.get(i); 
           	 membership.setPaymentNo(payment.getPaymentNo()); // 1단계실시한 결제번호 부여
           	 mapper.connectionPaymentType(membership); // PAYMENT_Type 연결
           	}
         	
         	i = 0; 
         	// 2-3단계: 기존맴버십일 경우 업데이트
            for (Integer membershipNo : validMembershipNumbers) {
                log.info("Linking3 existing membershipNo {} to paymentNo {}: {}", membershipNo, payment.getPaymentNo(), payment);
                Membership membership = membershipList.get(i); 
                i++;
                // 기존 멤버십 연결
                membership.setMembershipNo(membershipNo);
                mapper.updateMembership(membership);       
            }

        }

        
        // 3단계: 신규 멤버십 생성 및 연결
        if (emptyMembershipCount > 0) {
            processed = true; // 처리 상태 기록
            for (int i = 0; i < emptyMembershipCount; i++) {
                Membership membership = membershipList.get(i); // 신규 멤버십 정보 가져오기
                log.info("Creating new membership: {}", membership);

                // 3-1 단계 신규 MEMBERSHIP 생성
                mapper.newMembership(membership);

                // 3-2 단계 생성된 membershipNo와 결제 연결 (2-1과 동일)
                log.info("Linking new membershipNo {} to paymentNo {}: {}", membership.getMembershipNo(), payment.getPaymentNo());
                
                payment.setMembershipNo(membership.getMembershipNo());
                
                mapper.connectionPayment(payment); // PAYMENT_MEMBERSHIP 연결
              	
                membership.setPaymentNo(payment.getPaymentNo()); // 1단계실시한 결제번호 부여
               	mapper.connectionPaymentType(membership);
            }
        }
        
        // 4단계: 골드맴버십과 플레가 공존 있을 경우 골드 비활성화 (업그레이드처리)
        
        // 골드,플레 공존 조회
        int result = mapper.getMembershipUpgradeCount(payment.getEmployerNo());
        
        // 결과가 있다면 골드 비활성화
        if (result > 1) {
            mapper.updateOldMemberships(payment.getEmployerNo());
        }
        

        // 조건이 모두 충족되지 않았을 경우 예외를 던짐
        if (!processed) {
            throw new IllegalArgumentException("유효한 멤버십 번호도 없고 신규 멤버십 정보도 없습니다.");
        }

        log.info("Payment and membership linking completed for paymentNo: {}", payment.getPaymentNo());
    }



        
    
        
        
}






    






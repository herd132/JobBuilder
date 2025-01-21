package com.jobbuilder.project.payment.model.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import com.jobbuilder.project.employer.model.dto.Employer;
import com.jobbuilder.project.payment.model.dto.Membership;
import com.jobbuilder.project.payment.model.dto.Payment;

@Mapper
public interface PaymentMapper {
	
	// 사업주 조회
	

	// 맴버십 조회
	List<Membership> getMembershipDetails(int employerNo);
	
	// 결제 결과 조회
	List<Payment> getPaymentList(int employerNo);

	// 1단계 결제정보 저장
	void savePayment(Payment payment);

	// 2-1 , 3-2 단계: 기존맴버십일 경우 맴버십&결제 해소테이블의 정보를 담음
	void connectionPayment(Payment payment);
	
	// 2-2단계: 기존맴버십일 경우 결제 상세정보 테이블에 정보를 담음
	void connectionPaymentType(Membership membership);
	
	// 2-3단계: 기존맴버십일 경우 업데이트
	void updateMembership(Membership membership);

    // 2-4단계: 업그레이드 대상 조회 (결과 수 반환)
    int getMembershipUpgradeCount(int employerNo);

    // 2-4단계: 업그레이드 처리 (업데이트)
    void updateOldMemberships(int employerNo);
    
    // 3-1 단계 신규 MEMBERSHIP 생성
	void newMembership(Membership membership);

	List<Employer> getEmployerNo(int memberNo);

	
	
	
	void insertPaymentLog(Map<String, Object> paramMap);



	List<Map<String, Object>> getRefundMessages(int paymentNo);

	void unchangedMembership(Map<String, Object> unchangedMap);

	void changedMembership(Map<String, Object> changedMap);

	int processRefund(Integer paymentNo);


	

	
	// 3-2는 2-1과 동일
	// void connectionPayment(Payment payment);
}

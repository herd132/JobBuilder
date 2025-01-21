package com.jobbuilder.project.payment.model.service;

import java.util.List;
import java.util.Map;

import com.jobbuilder.project.employer.model.dto.Employer;
import com.jobbuilder.project.payment.model.dto.Membership;
import com.jobbuilder.project.payment.model.dto.Payment;

public interface PaymentService {

	List<Membership> getMembershipDetails(int employerNo);



	List<Payment> getPaymentList(int employerNo);

	List<Employer> getEmployerNo(int memberNo);

	void savePayment(Payment payment, List<Integer> validMembershipNumbers, int emptyMembershipCount,
			List<Membership> oldMembershipList, List<Membership> newMembershipList);



	boolean verifyPayment(String impUid, String merchantUid, int amount, int employerNo);



	String getRefundMessage(int paymentNo);

	String confirmRefund(int paymentNo);

	




}
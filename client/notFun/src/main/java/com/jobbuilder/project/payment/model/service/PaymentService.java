package com.jobbuilder.project.payment.model.service;

import java.util.List;

import com.jobbuilder.project.payment.model.dto.Membership;
import com.jobbuilder.project.payment.model.dto.Payment;

public interface PaymentService {

	List<Membership> getMembershipDetails(int employerNo);

	void savePayment(Payment payment, List<Integer> validMembershipNumbers, int emptyMembershipCount,
			List<Membership> membershipList);

	List<Payment> getPaymentList(int employerNo);




}
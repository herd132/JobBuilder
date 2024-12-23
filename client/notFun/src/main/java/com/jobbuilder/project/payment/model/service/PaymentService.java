package com.jobbuilder.project.payment.model.service;

import com.jobbuilder.project.payment.model.dto.Membership;

public interface PaymentService {

	Membership getMembershipDetails(Integer employerNo);

	
}
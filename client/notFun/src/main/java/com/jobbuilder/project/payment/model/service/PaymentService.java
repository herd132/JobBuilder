package com.jobbuilder.project.payment.model.service;

import java.util.List;

import com.jobbuilder.project.payment.model.dto.Membership;

public interface PaymentService {

	List<Membership> getMembershipDetails(int employerNo);


	
}
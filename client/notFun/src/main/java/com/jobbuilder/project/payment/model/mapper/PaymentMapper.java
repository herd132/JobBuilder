package com.jobbuilder.project.payment.model.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.jobbuilder.project.payment.model.dto.Membership;
import com.jobbuilder.project.payment.model.dto.Payment;
import com.jobbuilder.project.payment.model.dto.PaymentType;

@Mapper
public interface PaymentMapper {

	List<Membership> selectMembershipDetails(int employerNo);

	void savePayment(Payment payment);

	void connectionPayment(Payment payment);

	void newMembership(Membership membership);




	
}

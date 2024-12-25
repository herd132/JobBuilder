package com.jobbuilder.project.payment.model.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.jobbuilder.project.payment.model.dto.Membership;

@Mapper
public interface PaymentMapper {

	List<Membership> selectMembershipDetails(int employerNo);


	
}

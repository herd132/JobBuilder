package com.jobbuilder.project.payment.model.mapper;

import org.apache.ibatis.annotations.Mapper;

import com.jobbuilder.project.payment.model.dto.Membership;

@Mapper
public interface PaymentMapper {
    Membership selectMembershipDetails(Integer employerNo);
}

package com.jobbuilder.project.payment.model.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.jobbuilder.project.payment.model.dto.Membership;
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
	public Membership getMembershipDetails(Integer employerNo) {
		return mapper.selectMembershipDetails(employerNo);
    }
}

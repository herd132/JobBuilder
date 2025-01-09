package com.jobbuilder.project.refined.model.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.jobbuilder.project.refined.model.mapper.RefinedMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
@Slf4j
public class RefinedServiceImpl implements RefinedService {

	private final RefinedMapper mapper;
	
	
	
	
	
	
	
	
	
	
	
	
	
}

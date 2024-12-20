package com.jobbuilder.project.test.model.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.jobbuilder.project.test.model.mapper.TestMapper;

@Service
public class TestServiceImpl implements TestService {
	
	@Autowired
	private TestMapper mapper;

	@Override
	public int getNum() {
		return mapper.getNum();
	}
}

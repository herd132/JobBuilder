package com.jobbuilder.project.myPageEmployer.model.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.jobbuilder.project.myPageEmployer.model.mapper.MyPageEmployerMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
@Slf4j
public class MyPageEmployerServiceImpl implements MyPageEmployerService{

	private final MyPageEmployerMapper mapper;
}

package com.jobbuilder.project.myPageWorker.model.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.jobbuilder.project.myPageWorker.model.mapper.MyPageWorkerMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
@Slf4j
public class MyPageWorkerServiceImpl implements MyPageWorkerService{

	private final MyPageWorkerMapper mapper;
}

package com.jobbuilder.project.resume.model.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.jobbuilder.project.resume.model.mapper.ResumeMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
@Slf4j
public class ResumeServiceImpl implements ResumeService{
	
	private final ResumeMapper mapper;
}

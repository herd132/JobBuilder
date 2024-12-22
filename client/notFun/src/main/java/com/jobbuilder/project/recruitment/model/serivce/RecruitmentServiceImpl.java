package com.jobbuilder.project.recruitment.model.serivce;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.jobbuilder.project.recruitment.model.mapper.RecruitmentMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
@Slf4j
public class RecruitmentServiceImpl implements RecruitmentService{

	private final RecruitmentMapper mapper;
}

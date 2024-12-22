package com.jobbuilder.project.chatting.model.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.jobbuilder.project.chatting.model.mapper.ChattingMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
@Slf4j
public class ChattingServiceImpl implements ChattingService{

	private final ChattingMapper mapper;
}

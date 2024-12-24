package com.jobbuilder.project.counsel.model.service;

import org.springframework.stereotype.Service;

import com.jobbuilder.project.counsel.model.dto.Counselor;
import com.jobbuilder.project.counsel.model.mapper.CounselMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CounselServiceImpl implements CounselService {
	
	private final CounselMapper mapper;
	
	@Override
	public Counselor get(int memberNo) {
		return mapper.get(memberNo);
	}
}

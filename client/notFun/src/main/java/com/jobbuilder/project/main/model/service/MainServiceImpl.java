package com.jobbuilder.project.main.model.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.jobbuilder.project.board.model.dto.Board;
import com.jobbuilder.project.main.model.dto.Brand;
import com.jobbuilder.project.main.model.mapper.MainMapper;
import com.jobbuilder.project.serviceCenter.model.dto.ServiceCenter;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class MainServiceImpl implements MainService{
	
	private final MainMapper mapper;

	// 메인페이지 Top10 공고(로고)출력 (누적결제금액 많은순)
	@Override
	public List<Brand> selectTopBrand() {
		return mapper.selectTopBrand();
	}
	
	// 타입별 멤버십 공고 조회
	@Override
	public List<Brand> selectMembershipList(int type) {
		return mapper.selectMembershipList(type);
	}
	
	// 가장 최근 공고 10개 조회
	@Override
	public List<Brand> selectRecentRecruitments() {
		return mapper.selectRecentRecruitments();
	}
	
	// 최근 공지사항 3개 조회
	@Override
	public List<ServiceCenter> selectRecentNotice() {
		return mapper.selectRecentNotice();
	}
	
	// 최신 알바게시글 3개 조회
	@Override
	public List<Board> selectRecentBoard() {
		return mapper.selectRecentBoard();
	}
	
	// 곧 마감되는 알바 조회
	@Override
	public List<Map<String, Object>> selectUpcomingDeadlineJobs() {
		return mapper.selectUpcomingDeadlineJobs();
	}
}

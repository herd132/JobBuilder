package com.jobbuilder.project.main.controller;

import java.text.NumberFormat;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.jobbuilder.project.board.model.dto.Board;
import com.jobbuilder.project.main.model.dto.Brand;
import com.jobbuilder.project.main.model.service.MainService;
import com.jobbuilder.project.serviceCenter.model.dto.ServiceCenter;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Controller
@RequiredArgsConstructor
@Slf4j
public class MainController {

	private final MainService mainService;

	@RequestMapping("/")
	public String mainPage(HttpServletResponse resp, Model model) {

		// 오늘 기준 D-7 ~ D-DAY까지 공고 조회(곧 마감되는 알바)
		List<Map<String, Object>> upcomingDeadlineJobs = mainService.selectUpcomingDeadlineJobs();
		model.addAttribute("upcomingDeadlineJobs", upcomingDeadlineJobs);

		// -------------------------

		// Top 브랜드 10순위 조회
		List<Brand> topBrandList = mainService.selectTopBrand();

		model.addAttribute("topBrandList", topBrandList);

		// -------------------------

		// 플래티넘 공고 조회
		List<Brand> platinumBrandList = mainService.selectMembershipList(3); // 플래티넘 3

		// 한화단위로 변경
		platinumBrandList.forEach(brand -> {
			NumberFormat formatter = NumberFormat.getInstance(Locale.KOREA);
			brand.setFormatSalaryMount(formatter.format(brand.getSalaryMount()) + "원");
		});

		model.addAttribute("platinumBrandList", platinumBrandList);

		// -------------------------

		// 골드 공고 조회
		List<Brand> goldBrandList = mainService.selectMembershipList(2); // 골드 2

		// 한화단위로 변경
		goldBrandList.forEach(brand -> {
			NumberFormat formatter = NumberFormat.getInstance(Locale.KOREA);
			brand.setFormatSalaryMount(formatter.format(brand.getSalaryMount()) + "원");
		});

		model.addAttribute("goldBrandList", goldBrandList);

		// -------------------------

		// 가장 최근 공고 10개 조회
		List<Brand> recentRecruitmentList = mainService.selectRecentRecruitments();

		// 한화단위로 변경
		recentRecruitmentList.forEach(brand -> {
			NumberFormat formatter = NumberFormat.getInstance(Locale.KOREA);
			brand.setFormatSalaryMount(formatter.format(brand.getSalaryMount()) + "원");
		});

		model.addAttribute("recentRecruitmentList", recentRecruitmentList);

		// -----------------------
		// 최신 공지사항 3개 조회 , 최신 알바게시글 3개 조회
		List<ServiceCenter> noticeList = mainService.selectRecentNotice();
		List<Board> boardList = mainService.selectRecentBoard();

		model.addAttribute("noticeList", noticeList);
		model.addAttribute("boardList", boardList);

		// log.debug("recentRecruitmentList {}", recentRecruitmentList);
		return "main";
	}

	@RequestMapping("multiSignUp")
	public String multiSignUp(HttpServletResponse resp) {
		return "multiSignUp";
	}

	@RequestMapping("multiLogin")
	public String multiLogin() {
		return "multiLogin";
	}

	@GetMapping("loginError")
	public String loginError(RedirectAttributes ra) {
		ra.addFlashAttribute("message", "로그인 후 이용해 주세요~");
		return "redirect:/multiLogin";
	}

}

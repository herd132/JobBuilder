package com.jobbuilder.project.main.controller;

import java.text.NumberFormat;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.jobbuilder.project.main.model.dto.Brand;
import com.jobbuilder.project.main.model.service.MainService;

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
		
		// Top 브랜드 10순위 조회
		List<Brand> topBrandList = mainService.selectTopBrand();
		
		// 5개씩 묶은 리스트 생성
//        List<List<Brand>> chunkedList = new ArrayList<>();
//        for (int i = 0; i < topBrandList.size(); i += 5) {
//            int end = Math.min(i + 5, topBrandList.size());
//            chunkedList.add(topBrandList.subList(i, end));
//        }

        // chunkedList를 모델에 추가
        model.addAttribute("topBrandList", topBrandList);
        
        //-------------------------
        
        // 플래티넘 공고 조회
        List<Brand> platinumBrandList = mainService.selectMembershipList(3); // 플래티넘 3
        
        // 한화단위로 변경
        platinumBrandList.forEach(brand -> {
            NumberFormat formatter = NumberFormat.getInstance(Locale.KOREA);
            brand.setFormatSalaryMount(formatter.format(brand.getSalaryMount()) + "원");
        });
        
        model.addAttribute("platinumBrandList", platinumBrandList);
        
        //-------------------------
        
        // 골드 공고 조회
        List<Brand> goldBrandList = mainService.selectMembershipList(2);  // 골드 2
        
        // 한화단위로 변경
        goldBrandList.forEach(brand -> {
            NumberFormat formatter = NumberFormat.getInstance(Locale.KOREA);
            brand.setFormatSalaryMount(formatter.format(brand.getSalaryMount()) + "원");
        });
        
        model.addAttribute("goldBrandList", goldBrandList);
        
        //-------------------------
        
        // 가장 최근 공고 10개 조회
        List<Brand> recentRecruitmentList = mainService.selectRecentRecruitments();
        
        // 한화단위로 변경
        recentRecruitmentList.forEach(brand -> {
            NumberFormat formatter = NumberFormat.getInstance(Locale.KOREA);
            brand.setFormatSalaryMount(formatter.format(brand.getSalaryMount()) + "원");
        });
        
        model.addAttribute("recentRecruitmentList", recentRecruitmentList);
        
        //log.debug("recentRecruitmentList {}", recentRecruitmentList);
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
		ra.addFlashAttribute("message","로그인 후 이용해 주세요~");
		return "redirect:/multiLogin";
	}
	
}

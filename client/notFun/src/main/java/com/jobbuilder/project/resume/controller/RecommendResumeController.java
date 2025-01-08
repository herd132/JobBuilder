package com.jobbuilder.project.resume.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.SessionAttribute;

import com.jobbuilder.project.counsel.model.dto.Counselor;
import com.jobbuilder.project.employer.model.dto.Employer;
import com.jobbuilder.project.resume.model.dto.Resume;
import com.jobbuilder.project.resume.model.service.RecommendService;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Controller
@RequestMapping("recommend")
@Slf4j
@RequiredArgsConstructor
public class RecommendResumeController {
	
	public final RecommendService service;

	/** 추천 이력서
	 * @param loginEmployer
	 * @param recruitmentNo
	 * @return
	 * @author 신동국
	 */
	@GetMapping("resume")
	@ResponseBody
	public List<Map<String, Object>> recommend(@SessionAttribute(name = "loginEmployer", required = false) Employer loginEmployer,
								@RequestParam("recruitmentNo") int recruitmentNo) {
		
		List<Map<String, Object>> list = service.revommendResumeList(loginEmployer.getMemberNo(), recruitmentNo);

		return list;
	}
}

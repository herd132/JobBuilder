package com.jobbuilder.project.refined.Contoller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.SessionAttributes;

import com.jobbuilder.project.refined.model.dto.Refined;
import com.jobbuilder.project.refined.model.service.RefinedService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Controller
@RequestMapping("refined")
@RequiredArgsConstructor
@Slf4j
@SessionAttributes({ "loginEmployer", "loginWorker" })
public class RefinedContoller {

	private final RefinedService service;
	
	
	@GetMapping("list")
	public String refinedList() {
		return "refined/refinedList";
	}
	
	
	@PostMapping("/lista")
	@ResponseBody
	public Map<String, Object> getRecommendations() {
		
		Map<String, Object> response = new HashMap<>();
		
		// 공고 리스트 조회
		List<Refined> recruitment = service.getRecruitmentList();
		response.put("recruitment", recruitment);

		return response;
	}
	
	@PostMapping("/listb")
	@ResponseBody
	public Map<String, Object> getRecommendationsb(@RequestBody Map<String, Object> requestBody) {
	
		
		Map<String, Object> response = new HashMap<>();
		
	    Map<String, List<String>> categorySelections = (Map<String, List<String>>) requestBody.get("categorySelections");

	
		
		// 공고 리스트 조회
		List<Refined> recruitment = service.getRecruitmentListb(categorySelections);
		
		response.put("recruitment", recruitment);
		response.put("categorySelections", categorySelections);

		return response;
	}
	
	@PostMapping("/categories")
	@ResponseBody
	public Map<String, Object> getCategories() {
		
		Map<String, Object> response = new HashMap<>();
		
		// 지역별 중/소분류 조회
		List<Refined> refinedAddress1 = service.refinedAddress1();
		List<Refined> refinedAddress2 = service.refinedAddress2();
		
		// 업직종 중/소분류 조회
		List<Refined> refineJob1 = service.refineJob1();
		List<Refined> refineJob2 = service.refineJob2();
		
		// 근무기간 소분류 조회
		List<Refined> refinePeriod2 = service.refinePeriod2();
		
		// 근무요일 소분류 조회
		List<Refined> refineDays2 = service.refineDays2();
		
		// 근무시간 소분류 조회
		List<Refined> refineTime2 = service.refineTime2();
		
		// 근무형태 소분류 조회
		List<Refined> refineJobType2 = service.refineJobType2();
		
		// 학력 소분류 조회
		List<Refined> refineGrade2 = service.refineGrade2();
		
		// 복리후생 소분류 조회
		List<Refined> refineSupport2 = service.refineSupport2();
		
		// 우대사항 소분류 조회
		List<Refined> refinePreferred2 = service.refinePreferred2();
		
		// 급여부분 
		List<Refined> refineSalary2 = service.refineSalary2();
		
		response.put("refinedAddress1", refinedAddress1);
		response.put("refinedAddress2", refinedAddress2);
		response.put("refineJob1", refineJob1);
		response.put("refineJob2", refineJob2);
		response.put("refinePeriod2", refinePeriod2);
		response.put("refineDays2", refineDays2);
		response.put("refineTime2", refineTime2);
		response.put("refineJobType2", refineJobType2);
		response.put("refineGrade2", refineGrade2);
		response.put("refineSupport2", refineSupport2);
		response.put("refinePreferred2", refinePreferred2);
		response.put("refineSalary2", refineSalary2);
	
		return response;
	}
	
	
	
	
	
}

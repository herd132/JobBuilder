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

import com.jobbuilder.project.recruitment.model.dto.Recruitment;
import com.jobbuilder.project.refined.model.service.RefinedService;
import com.jobbuilder.project.resume.model.dto.Resume;
import com.jobbuilder.project.resume.model.dto.ResumeDaysTime;
import com.jobbuilder.project.resume.model.dto.ResumeWorkType;

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
	
	/*
	@PostMapping("/resumeRecommenda")
	@ResponseBody
	public Map<String, Object> getRecommendations(@RequestBody Map<String, Object> requestBody) {
		int recruitmentNo = Integer.parseInt(requestBody.get("recruitmentNo").toString());

		// 추천 공고 리스트 조회
		List<Recruitment> recommendations = service.getRecommendations(recruitmentNo);

		Map<String, Object> response = new HashMap<>();

		List<ResumeWorkType> resumeWorkType = service.resumeWorkType(recruitmentNo);
		List<String> resumeJobTypeList = service.resumeJobTypeList(recruitmentNo);
		List<ResumeDaysTime> resumeDaysTime = service.resumeDaysTime(recruitmentNo);
		List<String> workcondAddressTypeInfo = service.workcondAddressTypeInfo(recruitmentNo);

		response.put("resumeWorkType", resumeWorkType);
		response.put("resumeJobTypeList", resumeJobTypeList);
		response.put("resumeDaysTime", resumeDaysTime);
		response.put("workcondAddressTypeInfo", workcondAddressTypeInfo);
		response.put("recruitment", recruitment);
		response.put("recommendations", recommendations);

		return response;
	}
	*/
	
	
	
	
	
	
	
	
	
}

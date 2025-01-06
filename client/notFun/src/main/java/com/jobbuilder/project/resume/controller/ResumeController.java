package com.jobbuilder.project.resume.controller;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.SessionAttribute;
import org.springframework.web.bind.annotation.SessionAttributes;

import com.jobbuilder.project.resume.model.service.ResumeService;
import com.jobbuilder.project.worker.model.dto.Worker;
import com.jobbuilder.project.resume.model.dto.*;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@SessionAttributes({"loginWorker"})
@Controller
@RequestMapping("resume")
@RequiredArgsConstructor
@Slf4j
public class ResumeController {

	private final ResumeService service;
	
	@GetMapping("writeResume")
	public String writeResume(@SessionAttribute("loginWorker") Worker loginWorker, Model model){

		String year = loginWorker.getWorkerBirthDate().substring(0,4);
		model.addAttribute("year",year);
		List<Map<String,String>> majorCategoryList = service.selectMajorCategory();
		model.addAttribute("majorCategoryList", majorCategoryList);
		
		return "resume/writeResume";
	}
	
	/** workType 가 일치한 소분류 업직종 불러오기
	 * @param workTypeNo
	 * @return
	 */
	@ResponseBody
	@GetMapping("selectSubWorkType/{workTypeNo}")
	public List<Map<String,String>> subCategoryList(@PathVariable("workTypeNo") String workTypeNo) {
		return service.selectsubCategoryList(workTypeNo);
	}
	
	@PostMapping("writeResume")
	public String writeResume(@SessionAttribute ("loginWorker") Worker loginWorker,
							 @RequestParam ("gradeNo") int gradeNo, // 학력
							 @RequestParam ("workDateNo") int workDateNo,		// 근무기간
							 @RequestParam("payType") int payType, // 급여형태
							 @RequestParam(name = "inputPay", defaultValue = "0") int inputPay,  // int형은 null을 가질 수 없어 value값을 정해주거나 Integer 로 받아야 한다 // 원하는 급여
							 
							 @RequestParam (value = "workType", required=false) List<Integer> workTypeList, // 알바/정규직
							 // 이거부터 해결을 해보자
							 
							 
							 @RequestParam (value = "subCategory", required=false) List<String> subCategoryList, // 선호직종
							 
							 
							 
							 @RequestParam ("workDay") List<Integer> workDayList, // 근무일시(날짜)
							 @RequestParam ("workPart") List<Integer> workPartList, // 근무일시(파트타임)
							 
							 // dto Career 리스트지롱~ 
							 @RequestParam(value = "companyName", required=false) List<String> companyName, // 회사명
							 @RequestParam(value = "startDate", required=false) List<String> startDate, // 입사일
							 @RequestParam(value = "endDate", required=false) List<String> endDate, // 퇴사일
							 @RequestParam(value = "jobPart", required=false) List<String> jobPart // 담당업무
							 ) {
		
		int result = service.writeResume(loginWorker, gradeNo, workDateNo, payType,inputPay);
		
		
		log.debug("gradeNo : " + gradeNo);
		log.debug("subCategory : " + subCategoryList);
		log.debug("workType : " + workTypeList);
		log.debug("workDate : " + workDateNo);
		log.debug("workDay : " + workDayList);
		log.debug("workPart : " + workPartList);
		log.debug("payType : " + payType);
		log.debug("inputPay : " + inputPay);
		log.debug("companyName : " + companyName);
		log.debug("startDate : " + startDate);
		log.debug("endDate : " + endDate);
		log.debug("jobPart : " + jobPart);
		
		return null; 		
	}
	
	
}

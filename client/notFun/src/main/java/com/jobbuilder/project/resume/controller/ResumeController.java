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
	
	@ResponseBody
	@PostMapping("writeResume")
	public int writeResume(@SessionAttribute ("loginWorker") Worker loginWorker,
							 @RequestParam ("gradeNo") int gradeNo,
							 @RequestParam ("subCategory") List<String> subCategoryList,
//							 @RequestParam ("workTypeValue") int workTypeValue,
							 @RequestParam ("workDate") int workDate,
							 @RequestParam ("workDay") int workDay,
							 @RequestParam ("workPart") int workPart,
							 @RequestParam("payType") int payType
							 
							 ) {
		
		
		log.debug("gradeNo : " + gradeNo);
		log.debug("subCategory : " + subCategoryList);
//		log.debug("workTypeValue : " + workTypeValue);
		log.debug("workDate : " + workDate);
		log.debug("workDay : " + workDay);
		log.debug("workPart : " + workPart);
		log.debug("payType : " + payType);
		
		
		return 0;
		
	}
	
	
}

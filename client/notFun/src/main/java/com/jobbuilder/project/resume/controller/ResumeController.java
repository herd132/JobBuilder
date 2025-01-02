package com.jobbuilder.project.resume.controller;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.SessionAttribute;
import org.springframework.web.bind.annotation.SessionAttributes;

import com.jobbuilder.project.resume.model.service.ResumeService;
import com.jobbuilder.project.worker.model.dto.Worker;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jobbuilder.project.resume.model.dto.*;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@SessionAttributes({ "loginWorker" })
@Controller
@RequestMapping("resume")
@RequiredArgsConstructor
@Slf4j
public class ResumeController {

	private final ResumeService service;

	@GetMapping("writeResume")
	public String writeResume(@SessionAttribute("loginWorker") Worker loginWorker, Model model) {

		String year = loginWorker.getWorkerBirthDate().substring(0, 4);
		model.addAttribute("year", year);
		List<Map<String, String>> majorCategoryList = service.selectMajorCategory();
		model.addAttribute("majorCategoryList", majorCategoryList);

		return "resume/writeResume";
	}

	/**
	 * workType 가 일치한 소분류 업직종 불러오기
	 * 
	 * @param workTypeNo
	 * @return
	 */
	@ResponseBody
	@GetMapping("selectSubWorkType/{workTypeNo}")
	public List<Map<String, String>> subCategoryList(@PathVariable("workTypeNo") String workTypeNo) {
		return service.selectsubCategoryList(workTypeNo);
	}

	/**
	 * 이력서 작성 제출
	 * 
	 * @param loginWorker
	 * @param gradeNo
	 * @param workDateNo
	 * @param payType
	 * @param inputPay
	 * @param subCategoryList
	 * @param workTypeList
	 * @param workDayList
	 * @param workPartList
	 * @param companyName
	 * @param startDate
	 * @param endDate
	 * @param jobPart
	 * @return
	 * @throws JsonProcessingException 
	 * @throws JsonMappingException 
	 */
	@PostMapping("writeResume")
	public String writeResume(@SessionAttribute("loginWorker") Worker loginWorker, @RequestParam("gradeNo") int gradeNo, // 학력
			@RequestParam("periodNo") int periodNo, // 근무기간
			@RequestParam("salaryNo") int salaryNo, // 급여형태
			@RequestParam(name = "salaryAmount", defaultValue = "0") int salaryAmount, // int형은 null을 가질 수 없어 value값을
																						// 정해주거나 Integer 로 받아야 한다 // 원하는
																						// 급여
			@RequestParam("workTypeList") List<Integer> workTypeList, // 업직종고유번호 list,

			@RequestParam("careerInfoList") String careerInfoListJson, // 경력사항

			@RequestParam("jobTypeNo") List<Integer> jobTypeNo // 근무형태 list
			
			

	) throws JsonMappingException, JsonProcessingException {

		// int result = service.writeResume(loginWorker, gradeNo, workDateNo,
		// payType,inputPay);

		log.debug("loginWorker {}", loginWorker);
		log.debug("workTypeList {}", workTypeList);
		log.debug("gradeNo {} ", gradeNo); // 학력
		log.debug("periodNo {} ", periodNo);
		log.debug("salaryNo {} ", salaryNo);
		log.debug("salaryAmount {} ", salaryAmount);
		
		log.debug("careerInfoListJson {}", careerInfoListJson);

		ObjectMapper objectMapper = new ObjectMapper();
		List<CareerInfo> careerInfoList = objectMapper.readValue(careerInfoListJson,
				new TypeReference<List<CareerInfo>>() {
				});

		// 데이터 확인
		for (CareerInfo info : careerInfoList) {
			log.debug("info {}", info);
		}
		// log.debug("careerInfoList {} " , careerInfoList);
//		log.debug("companyName {} " , companyName);
//		log.debug("startDate {} " , startDate);
//		log.debug("endDate {} " , endDate);
//		log.debug("careerDescription {} " , careerDescription);

		return null;
	}

}

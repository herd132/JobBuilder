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
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jobbuilder.project.resume.model.dto.CareerInfo;

import com.jobbuilder.project.resume.model.dto.Resume;
import com.jobbuilder.project.resume.model.dto.ResumeDaysTime;

import com.jobbuilder.project.resume.model.service.ResumeService;
import com.jobbuilder.project.worker.model.dto.Worker;

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
		
		List<Map<String,String>> majorAddressList = service.selectAddressList();
		model.addAttribute("majorAddressList", majorAddressList);
		
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

	/** 주소 소분류 불러오기(사업장 추가페이지 내)
	 * @param workcondAddressTypeNo
	 * @return
	 */
	@ResponseBody
	@GetMapping("selectSubAddress/{workcondAddressTypeNo}")
	private List<Map<String, String>> subAddressList(@PathVariable("workcondAddressTypeNo") String workcondAddressTypeNo){
		return service.selectSubAddress(workcondAddressTypeNo);
	}
	
	
	/** 이력서 작성 제출
	 * @param loginWorker
	 * @param gradeNo 학력구분
	 * @param periodNo 기간구분
	 * @param salaryNo 급여형태
	 * @param salaryAmount 희망급여
	 * @param workTypeList 희망업종List
	 * @param careerInfoListJson 경력사항List JSON
	 * @param jobTypeNo 근로형태 list(알바/정규직)
	 * @param daysTimeListJson 희망요일시간List JSON
	 * @param 
	 * @return
	 * @throws JsonMappingException
	 * @throws JsonProcessingException
	 */
	@PostMapping("writeResume")
	public String writeResume(@SessionAttribute("loginWorker") Worker loginWorker, 
			@RequestParam(value = "salAmount", defaultValue = "0") int salAmount, 
			// int형은 null을 가질 수 없어 value값을 정해주거나 Integer 로 받아야 한다
			Resume resume,
			@RequestParam("workTypeList") List<String> workTypeList, // 업직종고유번호 list,
			@RequestParam("addressList") List<String> addressList, // 희망 근무지역 list
			@RequestParam("jobTypeNo") List<Integer> jobTypeNoList, // 근무형태 list
			@RequestParam(value ="careerInfoList", required = false) String careerInfoListJson, // 경력사항 JSON
			@RequestParam("daysTimeList") String daysTimeListJson, // 요일날짜 JSON
			RedirectAttributes ra
		) throws JsonMappingException, JsonProcessingException {

		log.debug("resume {}", resume); // gradeNo, periodNo, salaryNo, salaryAmount
		log.debug("희망업종 workTypeList {}", workTypeList);
		log.debug("근로형태 jobTypeNo {} ", jobTypeNoList);
		log.debug("희망급여 salAmount {} ", salAmount);		
		log.debug("careerInfoListJson {}", careerInfoListJson);
		log.debug("희망 근무지 addressList {}", addressList);
		log.debug("요일날짜 daysTimeListJson {}", daysTimeListJson);

		List<CareerInfo> careerInfoList = null;
		if(careerInfoListJson != null) {
			ObjectMapper objectMapper = new ObjectMapper();
			careerInfoList = objectMapper.readValue(careerInfoListJson,
					new TypeReference<List<CareerInfo>>() {
			});
			
			// 데이터 확인
			for (CareerInfo info : careerInfoList) {
				log.debug("경력사항 info {}", info);
			}
			
		}
	
		
		log.debug("daysTimeListJson {}", daysTimeListJson);

		List<ResumeDaysTime> daysTimeList = null;
		if(daysTimeListJson != null) {
			ObjectMapper objectMapper = new ObjectMapper();
			daysTimeList = objectMapper.readValue(daysTimeListJson,
					new TypeReference<List<ResumeDaysTime>>() {
			});
			
			// 데이터 확인
			for (ResumeDaysTime daysTime : daysTimeList) {
				log.debug("근무요일시간 daysTime {}", daysTime);
			}
		}
		
		
		//-------------------------
		
		// resume에 근로자번호 세팅
		resume.setWorkerNo(loginWorker.getWorkerNo());
		
		if(salAmount != 0) { // 희망급여가 있다면
			resume.setSalaryAmount(salAmount); // resume 객체에 세팅
			
		}
		
		int result = service.writeResume(resume, workTypeList, addressList, jobTypeNoList, careerInfoList, daysTimeList);
		
		String message = null;
		if(result > 0) {
			message = "이력서 작성 완료";
		} else {
			message = "이력서 작성 실패";
		}
		
		ra.addFlashAttribute(message);
		
		return "redirect:/myPageWorkee/myPageWorkerInfo";
	}

}

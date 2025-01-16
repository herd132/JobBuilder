package com.jobbuilder.project.resume.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.SessionAttribute;
import org.springframework.web.bind.annotation.SessionAttributes;

import com.jobbuilder.project.employer.model.dto.Employer;
import com.jobbuilder.project.recruitment.model.dto.Recruitment;
import com.jobbuilder.project.resume.model.dto.CareerInfo;
import com.jobbuilder.project.resume.model.dto.Resume;
import com.jobbuilder.project.resume.model.dto.ResumeDaysTime;
import com.jobbuilder.project.resume.model.dto.ResumeWorkType;
import com.jobbuilder.project.resume.model.service.ResumeListService;
import com.jobbuilder.project.worker.model.dto.Worker;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Controller
@RequestMapping("resume")
@RequiredArgsConstructor
@Slf4j
@SessionAttributes({ "loginEmployer", "loginWorker" })
public class ResumeListContorller {

	private final ResumeListService service;

	// 이력서리스트 페이지로 이동

	@GetMapping("resumeList")
	public String myPageWorkerInfo(HttpSession session) {
		Worker loginWorker = (Worker) session.getAttribute("loginWorker");
		// 세션에 loginWorker가 없는 경우 처리
		if (loginWorker == null) {
			return "error/error"; // 잘못된 접근을 처리할 HTML로 이동
		}
		return "resume/resumeList";
	}

	// 이력서 리스트 내 정보 가져오는 패치요청

	@PostMapping("/resumeLista")
	@ResponseBody
	public Map<String, Object> getResumeList(@SessionAttribute("loginWorker") Worker loginWorker) {
		Map<String, Object> response = new HashMap<>();

		try {
			if (loginWorker != null) {
				int workerNo = loginWorker.getWorkerNo();
				response.put("workerNo", workerNo); // workerNo를 응답에 포함
				List<Resume> resumeList = service.getResumeList(workerNo);
				response.put("resumeList", resumeList);
			} else {
				response.put("error", "로그인된 사용자가 없습니다.");
			}
		} catch (Exception e) {
			e.printStackTrace(); // 로그 출력
			response.put("error", "서버 오류가 발생했습니다.");
		}

		return response;
	}

	// 이력서리스트 삭제/수정 버튼 패치요청

	@PostMapping("/updateResumeStatus")
	public ResponseEntity<Map<String, Object>> updateResumeStatus(@RequestBody Resume resume) {
		Map<String, Object> response = new HashMap<>();
		try {
			int result = service.updateResumeStatus(resume);
			response.put("success", result > 0);
		} catch (Exception e) {
			response.put("success", false);
			response.put("error", e.getMessage());
		}
		return ResponseEntity.ok(response);
	}

	// 이력서디테일 페이지로 이동 (유효성검사)
	@GetMapping("/resumeDetail")
	public String resumeDetail(@RequestParam("resumeNo") int resumeNo,
							@RequestParam(value="recruitmentNo", required=false) int recruitmentNo,
							Model model, HttpSession session) {
		
		// 근로자 유효성 검사
		Worker loginWorker = (Worker) session.getAttribute("loginWorker");
		if (loginWorker != null) {
			Map<String, Object> result = service.getResumecheck(resumeNo, loginWorker.getWorkerNo());
			if (result == null) return "error/error";					// 유효성 검사후 중간에 리턴함
			model.addAttribute("resumeNo", result.get("RESUME_NO"));
		  return "resume/resumeDetail"; 								// 정상 리턴 경로
		}
		
		// 01.10 신동국 수정함 공고쪽 로직이랑 달라서 mapper 파일도 건드렸습니다. getEployeerNo에서 getMemberNo으로 수정
		// mapper.xml에서 당황하지 마시길
	    // 고용주 유효성 검사
	    Employer loginEmployer = (Employer) session.getAttribute("loginEmployer");
	    if (loginEmployer != null) {
	        Map<String, Object> result = service.getEmployercheck(resumeNo, loginEmployer.getMemberNo());
	        
	        // 욱재 추가(공고에 제출된 이력서 보기, 1.16.)
	        if (result == null) {
	        	result = service.getRecruitmentResumeCheck(resumeNo, recruitmentNo, loginEmployer.getMemberNo());
	        }
	        
	        if (result == null) return "error/error"; 
	        model.addAttribute("resumeNo", result.get("RESUME_NO"));
	        return "resume/resumeDetail";
	    }

		return "error/error"; 
	}

	// 이력서 상세 페이지 내 정보 가져오는 패치요청

	@PostMapping("/resumeDetaila")
	@ResponseBody
	public Map<String, Object> getResumeDetail(@RequestBody Map<String, Object> requestBody) {
		int resumeNo = Integer.parseInt(requestBody.get("resumeNo").toString());

		Resume resume = service.getResumeByNo(resumeNo);

		if (resume == null) {
			throw new IllegalArgumentException("Resume not found for resumeNo: " + resumeNo);
		}

		List<CareerInfo> careerInfo = service.careerInfo(resumeNo);
		List<ResumeWorkType> resumeWorkType = service.resumeWorkType(resumeNo);
		List<String> resumeJobTypeList = service.resumeJobTypeList(resumeNo);
		List<ResumeDaysTime> resumeDaysTime = service.resumeDaysTime(resumeNo);
		List<String> workcondAddressTypeInfo = service.workcondAddressTypeInfo(resumeNo);

		Map<String, Object> response = new HashMap<>();

		response.put("resume", resume);
		response.put("careerInfo", careerInfo);
		response.put("resumeWorkType", resumeWorkType);
		response.put("resumeJobTypeList", resumeJobTypeList);
		response.put("resumeDaysTime", resumeDaysTime);
		response.put("workcondAddressTypeInfo", workcondAddressTypeInfo);

		return response;
	}

	// 이력서 상세 페이지 자기소개 수정 예제

	@PostMapping("/updateContent")
	@ResponseBody
	public Map<String, Object> updateResumeContent(@RequestBody Map<String, Object> requestBody) {
		log.debug("requestBody : " + requestBody);
		int result = service.updateResumeContent(requestBody);

		Map<String, Object> response = new HashMap<>();
		if (result > 0) {
			response.put("status", "success");
			response.put("message", "자기소개가 성공적으로 업데이트되었습니다.");
		} else {
			response.put("status", "error");
			response.put("message", "업데이트에 실패했습니다.");
		}
		return response;
	}

	// 맞춤공고 목록페이지 이동

	@GetMapping("/resumeRecommend")
	public String getRecommendations(@RequestParam("resumeNo") int resumeNo, Model model, HttpSession session) {
		
		Worker loginWorker = (Worker) session.getAttribute("loginWorker");
		if (loginWorker != null) {
			Map<String, Object> result = service.getResumecheck(resumeNo, loginWorker.getWorkerNo());
			if (result == null) return "error/error";					// 유효성 검사후 중간에 리턴함
			model.addAttribute("resumeNo", result.get("RESUME_NO"));
		  return "resume/resumeRecommend"; 								// 정상 리턴 경로
		}
		return "error/error"; 
	}

	// 맞춤공고 목록 정보 가져오는 패치 요청

	@PostMapping("/resumeRecommenda")
	@ResponseBody
	public Map<String, Object> getRecommendations(@RequestBody Map<String, Object> requestBody) {
		int resumeNo = Integer.parseInt(requestBody.get("resumeNo").toString());

		Resume resume = service.getResumeByNo(resumeNo);
		if (resume == null) {
			throw new IllegalArgumentException("Resume not found for resumeNo: " + resumeNo);
		}

		// 추천 공고 리스트 조회
		List<Recruitment> recommendations = service.getRecommendations(resumeNo);

		Map<String, Object> response = new HashMap<>();

		List<ResumeWorkType> resumeWorkType = service.resumeWorkType(resumeNo);
		List<String> resumeJobTypeList = service.resumeJobTypeList(resumeNo);
		List<ResumeDaysTime> resumeDaysTime = service.resumeDaysTime(resumeNo);
		List<String> workcondAddressTypeInfo = service.workcondAddressTypeInfo(resumeNo);

		response.put("resumeWorkType", resumeWorkType);
		response.put("resumeJobTypeList", resumeJobTypeList);
		response.put("resumeDaysTime", resumeDaysTime);
		response.put("workcondAddressTypeInfo", workcondAddressTypeInfo);
		response.put("resume", resume);
		response.put("recommendations", recommendations);

		return response;
	}

	
	
	
	
	
	
	
	
	
	
	
	
	
}

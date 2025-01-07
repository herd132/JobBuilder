package com.jobbuilder.project.resume.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
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
@SessionAttributes({ "loginWorker" })
public class ResumeListContorller {

	private final ResumeListService service;
	
	@GetMapping("resumeList")
	public String myPageWorkerInfo(HttpSession session) {
		Worker loginWorker = (Worker) session.getAttribute("loginWorker");
        // 세션에 loginWorker가 없는 경우 처리
        if (loginWorker == null) {
            return "error/error"; // 잘못된 접근을 처리할 HTML로 이동
        }
		return "resume/resumeList";
	}
	
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
	

	    @GetMapping("/resumeDetail")
	    public String resumeDetail(@RequestParam("resumeNo") int resumeNo, Model model, HttpSession session) {
	        // 세션에서 loginWorker 조회
	        Worker loginWorker = (Worker) session.getAttribute("loginWorker");

	        // 세션에 loginWorker가 없는 경우 처리
	        if (loginWorker == null) {
	            return "error/error"; // 잘못된 접근을 처리할 HTML로 이동
	        }

	        // 데이터 조회
	        Resume resume = service.getResumeByNo(resumeNo);

	        // 이력서가 없는 경우 처리
	        if (resume == null) {
	            return "error/error"; // 잘못된 접근을 처리할 HTML로 이동
	        }

	        // 모델에 데이터 추가
	        model.addAttribute("resumeNo", resumeNo);
	        model.addAttribute("loginWorker", loginWorker);
	        return "resume/resumeDetail";
	    }


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

	        Map<String, Object> response = new HashMap<>();
	        
	        response.put("resume", resume);        
	        response.put("careerInfo", careerInfo); 
	        response.put("resumeWorkType", resumeWorkType); 
	        response.put("resumeJobTypeList", resumeJobTypeList);
	        response.put("resumeDaysTime", resumeDaysTime);
	        
	        return response; 
	    }


	    @PostMapping("/updateContent")
	    @ResponseBody
	    public Map<String, Object> updateResumeContent(@RequestBody Map<String, Object> requestBody) {
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




	    
	    
	    

	    @GetMapping("/resumeRecommend")
	    public String getRecommendations(@RequestParam("resumeNo") int resumeNo, Model model) {
	        // Resume 정보를 조회
	        Resume resume = service.getResumeByNo(resumeNo);

	        // 추천 공고 리스트 조회
	        List<Recruitment> recommendations = service.getRecommendations(resumeNo);

	        // 모델에 추가
	        model.addAttribute("resume", resume);
	        model.addAttribute("recommendations", recommendations);

	        // 추천 결과 페이지로 이동
	        return "resume/resumeRecommend"; // templates/resume/recommendations.html
	    }








    
    
	
	
}

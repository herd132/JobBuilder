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

import com.jobbuilder.project.recruitment.model.dto.Recruitment;
import com.jobbuilder.project.resume.model.dto.Resume;
import com.jobbuilder.project.resume.model.service.ResumeListService;
import com.jobbuilder.project.worker.model.dto.Worker;

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
	public String myPageWorkerInfo() {
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
	    public String resumeDetail(@RequestParam("resumeNo") int resumeNo, Model model,
	    		@SessionAttribute("loginWorker") Worker loginWorker) {
	        // resumeNo로 데이터를 조회
	    	
	    	
            if (loginWorker != null) {
            int workerNo = loginWorker.getWorkerNo();
            }
	    	
	        Resume resume = service.getResumeByNo(resumeNo);

	        // 모델에 데이터 추가
	        model.addAttribute("resume", resume);
	        model.addAttribute("loginWorker", loginWorker);
	        // 상세 페이지로 이동
	        return "resume/resumeDetail"; // templates/resume/resumeDetail.html
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

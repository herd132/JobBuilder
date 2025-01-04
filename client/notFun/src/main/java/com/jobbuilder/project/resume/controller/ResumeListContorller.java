package com.jobbuilder.project.resume.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.SessionAttribute;
import org.springframework.web.bind.annotation.SessionAttributes;

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
	@ResponseBody
	public Map<String, Object> updateResumeStatus(
	        @RequestBody Map<String, Object> requestData,
	        @SessionAttribute("loginWorker") Worker loginWorker) {
	    Map<String, Object> response = new HashMap<>();
	    try {
	        int resumeNo = (int) requestData.get("resumeNo");
	        String field = (String) requestData.get("field");
	        String value = (String) requestData.get("value");

	        // 업데이트 수행
	        boolean result = service.updateResumeStatus(resumeNo, field, value, loginWorker.getWorkerNo());

	        response.put("success", result);
	        response.put("message", result ? "상태 업데이트 성공" : "상태 업데이트 실패");
	    } catch (Exception e) {
	        e.printStackTrace();
	        response.put("success", false);
	        response.put("message", "서버 오류 발생");
	    }
	    return response;
	}

    
    
	
	
}

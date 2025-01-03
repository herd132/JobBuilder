package com.jobbuilder.project.resume.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
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
    public Map<String, Object> getPaymentList(@SessionAttribute("loginWorker") Worker loginWorker) {
        Map<String, Object> response = new HashMap<>();
        try {
            List<Resume> resumeList = service.getResumeList(loginWorker.getWorkerNo());
            response.put("resumeList", resumeList);
        } catch (Exception e) {
            e.printStackTrace();  // 로그에 오류를 출력
            response.put("error", "서버 오류가 발생했습니다.");
        }
        return response;
    }
    
    
	
	
}

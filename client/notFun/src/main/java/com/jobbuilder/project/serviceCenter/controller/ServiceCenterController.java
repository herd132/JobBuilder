package com.jobbuilder.project.serviceCenter.controller;

import java.net.http.HttpRequest;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import com.jobbuilder.project.employer.model.dto.Employer;
import com.jobbuilder.project.serviceCenter.model.dto.InquiryOneOnOne;
import com.jobbuilder.project.serviceCenter.model.service.ServiceCenterService;
import com.jobbuilder.project.worker.model.dto.Worker;

import jakarta.mail.Session;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Controller
@RequiredArgsConstructor
@RequestMapping("serviceCenter")
public class ServiceCenterController {

	private final ServiceCenterService service;
	
	// 공지사항으로 이동
	@GetMapping("notice")
	public String notice() {
		return "serviceCenter/notice";
	}

	// FAQ로 이동
	@GetMapping("faq")
	public String faq() {
		return "serviceCenter/FAQ";
	}
	
	// 문의 내역으로 이동
	@GetMapping("inquiry")
	public String inquiry() {
		return "serviceCenter/inquiry";
	}
	
	
	/** 문의 보내기
	 * @param images
	 * @param map
	 * @return
	 */
	@PutMapping("inquirysInsert")
	@ResponseBody
	public int inquiryInsert( @RequestPart("images") List<MultipartFile> images,
								@RequestPart("inquiry") InquiryOneOnOne inquiry,
								HttpServletRequest req) throws Exception{
		
		HttpSession session = req.getSession();

    	if (session.getAttribute("loginWorker") != null) inquiry.setMemberNo(((Worker)session.getAttribute("loginWorker")).getMemberNo());
    	if (session.getAttribute("loginEmployer") != null) inquiry.setMemberNo(((Employer)session.getAttribute("loginEmployer")).getMemberNo());
    	
		return service.inquiryInsert(images, inquiry);
	}
	
}

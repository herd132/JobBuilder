package com.jobbuilder.project.recruitment.controller;

import java.util.List;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.SessionAttribute;
import org.springframework.web.bind.annotation.SessionAttributes;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.jobbuilder.project.employer.model.dto.Employer;
import com.jobbuilder.project.recruitment.model.dto.Recruitment;
import com.jobbuilder.project.recruitment.model.serivce.RecruitmentService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Controller
@RequestMapping("recruitment")
@SessionAttributes({"loginEmployer"})
@RequiredArgsConstructor
@Slf4j
public class RecruitmentController {

	/* ********** 필드 ********** */
	private final RecruitmentService service;
	
	/* ********** 메서드 ********** */

	/** 사업장 추가 페이지 이동(get)
	 * @param loginEmployer
	 * @param model
	 * @return
	 * @author JWJ
	 */
	@GetMapping("addRecruitment")
	private String addRecruitment(@SessionAttribute("loginEmployer") Employer loginEmployer,
							Model model) {
		
		List<Employer> businessList = service.selectBusinessList(loginEmployer.getMemberNo());
		
		model.addAttribute("businessList", businessList);

		return "recruitment/addRecruitment";
	}
	
	@PostMapping("addRecruitment")
	private String addRecruitment(@SessionAttribute("loginEmployer") Employer loginEmployer,
								Recruitment addRecruitment,
								@RequestParam(value="images", required=false) List<MultipartFile> images,
								RedirectAttributes ra) {
		
		return null;
	}
}

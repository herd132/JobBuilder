package com.jobbuilder.project.employer.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.SessionAttributes;
import org.springframework.web.bind.support.SessionStatus;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.jobbuilder.project.employer.model.dto.Employer;
import com.jobbuilder.project.employer.model.service.EmployerService;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Controller
@RequestMapping("employer")
@SessionAttributes({"loginEmployer"})
@RequiredArgsConstructor
@Slf4j
public class EmployerController {
	
	/* ********** 필드 ********** */
	private final EmployerService service;

	/* ********** 메서드 ********** */

	/** 고용주 회원가입 페이지 이동(get)
	 * @return
	 * @author JWJ
	 */
	@GetMapping("employerSignUp")
	public String EmployerSignup() {
		return "employer/employerSignUp";
	}
	
	/** 고용주 로그인 페이지 이동(get)
	 * @return
	 * @author JWJ
	 */
	@GetMapping("employerLogin")
	public String EmployerLogin() {
		return "employer/employerLogin";
	}
	
	/** 고용주 로그인(post)
	 * @param loginEmployer
	 * @return
	 * @author JWJ
	 */
	@PostMapping("employerLogin")
	public String EmployerLogin(Employer inputEmployer,
								@RequestParam(value="saveId", required=false) String saveId,
								Model model, HttpServletResponse resp,
								RedirectAttributes ra) {
		
		Employer loginEmployer = service.login(inputEmployer);
		
		String path = null;
		String message = null;
		
		if(loginEmployer == null) {
			path = "employerLogin";
			message = "아이디 또는 비밀번호가 일치하지 않습니다";
			
		} else {
			log.debug("loginEmployer : " + loginEmployer);
			path = "/";
			
			model.addAttribute("loginEmployer", loginEmployer);
			Cookie cookie = new Cookie("saveId", loginEmployer.getMemberEmail());
			cookie.setPath("/");
			
			if(saveId != null) cookie.setMaxAge(60*60*24*30);
			else cookie.setMaxAge(0);
			
			resp.addCookie(cookie);
		}
		
		ra.addFlashAttribute("message", message);
		
		return "redirect:" + path;
	}
	
	/** 고용주 로그아웃(get)
	 * @return
	 * @author JWJ
	 */
	@GetMapping("employerLogout")
	public String EmployerLogout(SessionStatus status) {
		status.setComplete();
		return "redirect:/";
	}
	
	/* ********** 고용주 회원가입 ********** */
	
	/** 이메일 중복검사(비동기)
	 * @param memberEmail
	 * @return
	 * @author JWJ
	 */
	@ResponseBody
	@GetMapping("checkEmail")
	public int checkEmail(@RequestParam("memberEmail") String memberEmail) {
		return service.checkEmail(memberEmail);
	}
	
	/** 고용주 회원가입(post)
	 * @param inputEmployer(memberEmail, memberPw, memberName, memberTel,
	 * 						businessRegistrationNumber, businessName, optionalAgreeFl)
	 * @param businessAddress(우편번호, 도로명/지번주소, 상세주소)
	 * @return
	 */
	@PostMapping("employerSignUp")
	public String EmployerSignUp(Employer inputEmployer,
								@RequestParam("businessAddress") String[] businessAddress,
								RedirectAttributes ra) {
		
		int result = service.signUp(inputEmployer, businessAddress);
		
		String path = null;
		String message = null;
		
		if(result > 0) {
			message = inputEmployer.getBusinessName() + "님의 가입을 환영합니다!";
			path = "/";
			
		} else {
			message = "회원가입실패...!";
			path = "employerSignUp";
		}
		
		ra.addFlashAttribute("message", message);
		return "redirect:" + path;
	}
	
}

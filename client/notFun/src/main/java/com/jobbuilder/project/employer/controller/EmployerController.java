package com.jobbuilder.project.employer.controller;

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
import org.springframework.web.bind.annotation.SessionAttributes;
import org.springframework.web.bind.support.SessionStatus;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.jobbuilder.project.employer.model.dto.Employer;
import com.jobbuilder.project.employer.model.service.EmployerService;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import oracle.jdbc.proxy.annotation.Post;

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
	
	/** 고용주 이메일 찾기 페이지 이동(get)
	 * @return
	 */
	@GetMapping("employerFindEmail")
	public String EmployerFindEmail () {
		return "employer/employerFindEmail";
	}
	
	/** 고용주 이메일 찾기(사업자 번호로)
	 * @param map(memberName, businessRegistrationNumber)
	 * @return
	 */
	@ResponseBody
	@PostMapping("findEmailByBusinessRegistrationNumber")
	public ResponseEntity<String> findEmailByBusinessRegistrationNumber(@RequestBody Map<String, Object> map) {

		String result = service.findEmailByBusinessRegistrationNumber(map);
		
		if(result == null) return ResponseEntity.noContent().build();
		
		return ResponseEntity.ok(result);
	}
	
	/** 고용주 이메일 찾기(전화번호로)
	 * @param map(memberName, memberTel)
	 * @return
	 */
	@ResponseBody
	@PostMapping("findEmailByPhoneNumber")
	public ResponseEntity<String> findEmailByPhoneNumber(@RequestBody Map<String, Object> map){
		
		String result = service.findEmailByPhoneNumber(map);
		
		if(result == null) return ResponseEntity.noContent().build();
		
		return ResponseEntity.ok(result);
	}
	
	/** 고용주 비밀번호 찾기 페이지 이동(get)
	 * @return
	 */
	@GetMapping("employerFindPw")
	public String EmployerFindPw () {
		return "employer/employerFindPw";
	}
	
	/** 고용주가 가입한 (이름, 이메일) 조회
	 * @param map(memberName, memberEmail)
	 * @return
	 */
	@ResponseBody
	@PostMapping("checkNameEmail")
	public ResponseEntity<String> checkNameEmail(@RequestBody Map<String, Object> map) {
		
		String result = service.checkNameEmail(map);
		
		if(result == null) return ResponseEntity.noContent().build();
		
		return ResponseEntity.ok(result);
	}
	
	/** 고용주 비밀번호 새로 설정
	 * @param map(memberEmail, memberPw)
	 * @return
	 */
	@ResponseBody
	@PostMapping("changePw")
	public ResponseEntity<String> changePw (@RequestBody Map<String, String> map) {
		
		log.debug("컨트롤러 단 map : " + map);
		
		String result = service.changePw(map);
		
		if(result == null) return ResponseEntity.noContent().build();
		
		return ResponseEntity.ok(result);
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
		
		String message = null;
		
		if(loginEmployer == null) {
			message = "아이디 또는 비밀번호가 일치하지 않습니다";
			
		} else {
			log.debug("loginEmployer : " + loginEmployer);
			
			model.addAttribute("loginEmployer", loginEmployer);
			Cookie cookie = new Cookie("saveId", loginEmployer.getMemberEmail());
			cookie.setPath("/");
			
			if(saveId != null) cookie.setMaxAge(60*60*24*30);
			else cookie.setMaxAge(0);
			
			resp.addCookie(cookie);
		}
		
		ra.addFlashAttribute("message", message);
		
		return "redirect:/";
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
	
	/** 전화번호 중복검사(비동기) 
	 * @param employerTel
	 * @return
	 */
	@ResponseBody
	@GetMapping("checkTel")
	public int chekcTel(@RequestParam("memberTel") String employerTel) {
		return service.checkTel(employerTel);
	}
	
	/** 고용주 회원가입(post)
	 * @param inputEmployer(memberEmail, memberPw, memberName, memberTel,
	 * 						businessRegistrationNumber, businessName)
	 * @param businessAddress(우편번호, 도로명/지번주소, 상세주소)
	 * @param optionalAgree(선택약관 동의여부)
	 * @return
	 */
	@PostMapping("employerSignUp")
	public String EmployerSignUp(Employer inputEmployer,
								@RequestParam("businessAddress") String[] businessAddress,
								@RequestParam(value="optionalAgree", required=false) String optionalAgree,
								RedirectAttributes ra) {
		
		int result = service.signUp(inputEmployer, businessAddress, optionalAgree);
		
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

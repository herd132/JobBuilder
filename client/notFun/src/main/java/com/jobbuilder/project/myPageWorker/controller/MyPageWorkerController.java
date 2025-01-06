package com.jobbuilder.project.myPageWorker.controller;


import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.SessionAttribute;
import org.springframework.web.bind.annotation.SessionAttributes;
import org.springframework.web.bind.support.SessionStatus;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.jobbuilder.project.myPageWorker.model.service.MyPageWorkerService;
import com.jobbuilder.project.worker.model.dto.Worker;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;


@Controller
@RequestMapping("myPageWorkee")
@RequiredArgsConstructor
@Slf4j
@SessionAttributes({ "loginMember" })
public class MyPageWorkerController {

	private final MyPageWorkerService service;
	
	
	/**
	 * @return 회원정보 페이지 이동
	 */
	@GetMapping("myPageWorkerInfo")
	public String myPageWorkerInfo() {
		return "myPageWorker/info";
	}
	
	
	/**
	 * @return 회원 정보 수정 페이지 이동
	 */
	@GetMapping("updateInfo")
	public String updateInfo() {
		return "myPageWorker/updateInfo";
	}
	
	/**
	 * @return 회원탈퇴
	 */
	@GetMapping("myPageWorkerSecession")
	public String myPageWorkerSecession() {
		return "myPageWorker/secession";
	}
	
	/**
	 * @return 비밀번호 변경 페이지 이동
	 */
	@GetMapping("myPageWorkerChangePw")
	public String myPageWorkerChangePw() {
		return "myPageWorker/changePw";
	}
	
	/** 비밀번호 변경
	 * @param loginWorker
	 * @param WorkerPw
	 * @param ra
	 * @return
	 */
	@PostMapping("changePw")
	public String WorkerChangePw(@SessionAttribute("loginWorker") Worker loginWorker,
								@RequestParam("WorkerPw") String WorkerPw,
								RedirectAttributes ra,
								SessionStatus status,
								HttpSession session) {
		log.debug("workerPw : " + WorkerPw);
		log.debug("memberNo : " + loginWorker.getMemberNo());
		
		int result = service.workerChangePw(loginWorker.getMemberNo(),WorkerPw);
		
		String message = null;
		
		if(result > 0) { 
			
			message = "비밀번호가 성공적으로 변경되었습니다. 다시 로그인 해주세요~";
			session.invalidate();				
			
		}
		
		ra.addFlashAttribute("message", message);  
		
		return "redirect:/"; 
		
	}

	
	/**
	 * @param workerNickname
	 * @return 닉네임 유효성 검사
	 */
	@ResponseBody
	@GetMapping("checkNickname")
	public int checkNickname(@RequestParam("workerNickname") String workerNickname ) {
		return service.checkNickname(workerNickname);
	}
	
	/**
	 * @param memberTel
	 * @return 연락처 유효성 검사
	 */
	@ResponseBody
	@GetMapping("checkMemberTel")
	public int checkMemberTel(@RequestParam("memberTel") String memberTel) {
		return service.checkMemberTel(memberTel);
	}
	
	/**
	 * @param currentPassword
	 * @param loginWorker 현재 비밀번호 확인
	 * @return
	 */
	@ResponseBody
	@PostMapping("checkPw")
	public int checkPw(@RequestBody String currentPassword, @SessionAttribute("loginWorker") Worker loginWorker) {
				int result = service.checkPw(currentPassword,loginWorker);
				return result;
	}
	
	
	@ResponseBody
	@PostMapping("updateInfo")
	public int updateInfo(  @RequestParam("workerNickname") String workerNickname,
							@RequestParam("postcode") String postcode,
							@RequestParam("address") String address,
							@RequestParam("detailAddress") String detailAddress,
							@RequestParam("memberTel") String memberTel,
							@RequestParam("workerMbti") String workerMbti,
							@RequestParam("memberEmail") String memberEmail,
							@RequestParam(value = "profileImg", required = false) MultipartFile profileImg,
							@SessionAttribute("loginWorker") Worker loginWorker) {
		
		String[] workerAddress = {postcode, address, detailAddress};
		
		
		loginWorker.setWorkerNickname(workerNickname);
		loginWorker.setMemberTel(memberTel);
		loginWorker.setWorkerMbti(workerMbti);
		loginWorker.setMemberEmail(memberEmail);
		log.debug("loginWorker : " + loginWorker);
		int result = service.updateInfo(loginWorker,workerAddress);
		return result; 
	}
}

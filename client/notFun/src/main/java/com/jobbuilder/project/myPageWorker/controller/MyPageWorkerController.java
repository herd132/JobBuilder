package com.jobbuilder.project.myPageWorker.controller;


import java.util.List;

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

import com.jobbuilder.project.board.model.dto.Board;
import com.jobbuilder.project.myPageWorker.model.service.MyPageWorkerService;
import com.jobbuilder.project.worker.model.dto.Worker;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;


@Controller
@RequestMapping("myPageWorkee")
@RequiredArgsConstructor
@Slf4j
@SessionAttributes({ "loginWorker" })
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
	
	/**
	 * @return 작성 글 목록으로 이동
	 */
	@GetMapping("myPageWorkerWrite")
	public String myPageWorkerWrite() {
		return "myPageWorker/writeBoard";
	}
	
	/**
	 * @return 작성 글 제목 가져오기
	 */
	@ResponseBody
	@GetMapping("writeView")
	public List<Board> writeView( @RequestParam(value="cp",required = false, defaultValue = "1") int cp,
			@SessionAttribute("loginWorker") Worker loginWorker) {
	    int memberNo = loginWorker.getMemberNo();
	    
	    // 페이지와 크기를 고려하여 해당 페이지에 맞는 데이터 조회
	    List<Board> titles = service.writeView(memberNo, cp);

	    return titles;  // List<Board> 반환
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
								SessionStatus status) {		
		
		int result = service.workerChangePw(loginWorker.getMemberNo(),WorkerPw);
		
		String message = null;
		
		if(result > 0) { 
			
			message = "비밀번호가 성공적으로 변경되었습니다. 다시 로그인 해주세요~";
			status.setComplete();				
			
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
	
	
	@GetMapping("secession")
	public String secession(@SessionAttribute("loginWorker") Worker loginWorker,
							HttpSession session,
							RedirectAttributes ra) {
		
		int result = service.secession(loginWorker);
		
		String message = null;
		
		if(result > 0) { 
			
			session.invalidate();				
			message = "회원탈퇴 되었습니다. 그동안 이용해 주셔서 감사합니다.";
			
		}
		
		ra.addFlashAttribute("message", message);  
		
		return "redirect:/";
	}
	
	
	@PostMapping("updateInfo")
	public String updateInfo(@SessionAttribute("loginWorker") Worker loginWorker,
							@RequestParam(value = "workerNickname", required = false) String workerNickname,
					        @RequestParam(value = "memberTel", required = false) String memberTel,
					        @RequestParam(value = "memberEmail", required = false) String memberEmail,
					        @RequestParam(value = "workerMbti", required = false) String workerMbti,
					        @RequestParam(value = "imageInput", required = false) MultipartFile imageInput,
					        @RequestParam(value = "workerAddress", required = false) String[] workerAddress,
					        @RequestParam("status") int status,
					        RedirectAttributes ra) throws Exception {
		log.debug("status : " + status);
		if (workerNickname != null) {
			loginWorker.setWorkerNickname(workerNickname);
		}
		
		if (memberTel != null) {
			loginWorker.setMemberTel(memberTel);
		}
		
		if (memberEmail != null) {
			loginWorker.setMemberEmail(memberEmail);
		}
		
		loginWorker.setWorkerMbti(workerMbti);
		
		int result = service.updateInfo(loginWorker, imageInput, workerAddress, status);

		// 변경 성공 시 "변경되었습니다." 메시지
		String message = null;

		if (result > 0)
			message = "변경되었습니다.";
		else
			message = "변경에 실패하였습니다.";

		ra.addFlashAttribute("message", message);

		return "redirect:myPageWorkerInfo";

	}
}

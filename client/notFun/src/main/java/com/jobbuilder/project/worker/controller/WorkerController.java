package com.jobbuilder.project.worker.controller;

import org.springframework.stereotype.Controller;

import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.SessionAttributes;
import org.springframework.web.bind.support.SessionStatus;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.jobbuilder.project.worker.model.dto.Worker;
import com.jobbuilder.project.worker.model.service.WorkerService;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.Value;
import lombok.extern.slf4j.Slf4j;

@Controller
@RequestMapping("worker")
@RequiredArgsConstructor
@Slf4j
@SessionAttributes({"loginWorker"})
public class WorkerController {

	private final WorkerService service;
	
	
	/*                        단순 페이지 보여주는 경우                       */
	
	/** 회원가입 페이지로 이동
	 * @return
	 */
	@GetMapping("workerSignUp") 
	public String signupPage()  {
		
		return "worker/workerSignUp";
	}
	
	/** 로그인 페이지로 이동
	 * @return
	 */
	@GetMapping("workerLogin")
	public String workerLogin() {
		return "worker/workerLogin";
	}
	
	// 이메일로 아이디 찾기 페이지 이동
	@GetMapping("workerFindEmail")
	public String findEmailPage() {
		return "worker/workerFindEmail";
	}
		
	// 비밀번호 찾기
	@GetMapping("workerFindPw")
	public String workerFindPw() {
		return "worker/workerFindPw";
	}
	
	// 비밀번호 변경
	@GetMapping("workerChangePw")
	public String workerChangePw() {
		return "worker/workerChangePw";
	}
	
	// 비밀번호 찾기 후 변경화면 이동
	@GetMapping("workerFindChangePw")
	public String workerFindChangePw() {
		return "worker/workerFindChangePw";
	}
	

	
	
	/** 회원 로그인 ( 근로자 )
	 * @param workerMember
	 * @param ra
	 * @param model
	 * @param saveId
	 * @param resp
	 * @return
	 */
	@PostMapping("workerLogin")
	public String login(Worker inputWorker,
						@RequestParam(value="saveId", required = false) String saveId,
						Model model, HttpServletResponse resp,
						RedirectAttributes ra) {		
			
			try {
				Worker loginWorker = service.login(inputWorker);
				
				String message = null;
				
				// 로그인 실패 시
				if (loginWorker == null) {
					
					message = " 아이디 또는 비밀번호가 일치하지 않습니다.";
				} else {
					
					
					
					model.addAttribute("loginWorker", loginWorker);
					
					// ******************* Cookie ***********************
					Cookie cookie = new Cookie("saveId", loginWorker.getWorkerId());		
					cookie.setPath("/");
					
					if(saveId != null) { // 아이디 저장을 체크 시
						cookie.setMaxAge(31536000); // 초 단위로 지정 ( 30일 )
						
					} else { // 미체크 시
						cookie.setMaxAge(0); // 0초 (클라이언트에서 쿠키삭제 )				
					}
					
					// 응답 객체에 쿠키 추가 -> 클라이언트 전달
					resp.addCookie(cookie);
					
				}
				
				ra.addFlashAttribute("message", message);
				
			} catch (Exception e) {
				
				e.printStackTrace();
			}
			
			return "redirect:/"; // 메인페이지에 재요청	
	}
	
	/** 회원 로그아웃 ( 근로자 )
	 * @param status
	 * @return
	 */
	@GetMapping("workerLogout")
	public String logout(SessionStatus status ) {
		
		status.setComplete(); // 세션을 완료시킴 ( == 세션에서 @SessionAttributes로 등록된 걸 제거
		
		// 로그인 -> session 에 loginMember가 들어있음
		
		
		return "redirect:/";
	}
	
	
	
	// form태그는 비동기가 아니라 동기식요청
		/** 회원 가입 
		 * @param inputMember : 입력된 회원 정보 ( memberEmail, memberPw, memberNickname, memberTel, 
		 * 												  (memberAddress - 따로 배열로 받아서 처리))
		 * @param memberAddress : 입력한 주소 input 3개의 값을 배열로 전달 [우편번호, 도로명/지번주소, 상세주소 ] 
		 * @param ra : 리다이렉트 시 request scope로 데이터 전달하는 객체
		 * @return
		 */
		@PostMapping("workerSignUp")
		public String signup(@ModelAttribute/*생략가능*/ Worker inputWorker,							
							@RequestParam("memberAddress") String[] memberAddress,
							@RequestParam("signUpPath") int signUpPath,
							RedirectAttributes ra) {
			
			// 회원가입 서비스 호출
			log.debug("signUpPath" + signUpPath);
			int result = service.signup(inputWorker, memberAddress);
			
			String path = null;
			String message = null;
			
			if(result > 0) { // 성공
				
				message = inputWorker.getWorkerNickname() + "님의 가입을 환영 합니다~";
				path = "/"; // 메인페이지로 재요청
			} else { // 실패
				
				message = "회원가입 실패..";
				path = "signup";
			}
			
			ra.addFlashAttribute("message",message);
			
				
			return "redirect:"+path;
		}
		
		// 비밀번호 찾기
		@PostMapping("workerFindPw")
		public String findPw(Worker inputWorker, RedirectAttributes ra, HttpSession session) {
			Worker findPw = service.workerFindPw(inputWorker);
		    
		    if (findPw == null) {
		        ra.addFlashAttribute("message", "회원정보가 존재하지 않습니다"); 
		        return "redirect:/worker/workerFindPw";   
		    } else {
		        session.setAttribute("findPw", findPw); // HttpSession에 저장
		        return "redirect:/worker/workerChangePw"; 
		    }											// 조회된 회원정보를 바뀐 페이지로 출력하기 때문에
		    											// 세션에 실린값을 리다이렉트
		                   
		}
	    
	    
		/** 비밀번호 찾기 기능 - 2/2 조회된 회원의 비밀번호 변경
		 * @param session
		 * @param newPw
		 * @param ra
		 * @return
		 * @author 
		 */
		@PostMapping("workerChangePw")
		public String findChangePw(HttpSession session,
		                           @RequestParam("newPw") String newPw,
		                           RedirectAttributes ra) {
			Worker findPw = (Worker)session.getAttribute("findPw");
		    
		    if (findPw == null) {
		        ra.addFlashAttribute("message", "세션이 만료되었습니다. 다시 시도해주세요.");
		        return "redirect:/worker/findPw";
		    }
		    
		    int result = service.findChangePw(findPw.getMemberNo(), newPw);
		    String message = result > 0 ? "비밀번호가 변경되었습니다" : "비밀번호 변경 실패";
		    
		    ra.addFlashAttribute("message", message);
		    session.removeAttribute("findPw");             // 사용 완료된 조회값을 세션에서 제거
		    											   // 로그인화면으로 리다이렉트
		    return "redirect:/worker/workerLogin";
		}
	    
		/** 비밀번호 찾기 내 전화번호 중복검사(비동기)
		 * @param memberTel
		 * @return
		 */
		@ResponseBody
		@GetMapping("checkMemberTel2")
		public int checkMemberTel2(@RequestParam("memberTel") String memberTel, 
		                           @RequestParam("memberName") String memberName) {
			Worker inputWorker = new Worker();
		    inputWorker.setMemberTel(memberTel);
		    inputWorker.setMemberName(memberName);

		    return service.checkMemberTel2(inputWorker);
		}

		// 이메일로 아이디 찾기
		@PostMapping("workerFindEmail")
		public String workerFindEmailResult(Worker inputWorker, RedirectAttributes ra) {
			
			Worker workerFindEmail = service.workerFindEmail(inputWorker);
			String message = null;
			
			if(workerFindEmail == null) {
	            message = "회원정보가 존재하지 않습니다";
	            ra.addFlashAttribute("message", message); 
	        } else {
	            ra.addFlashAttribute("workerFindEmail", workerFindEmail); 
	        }
			
			return "redirect:/worker/workerFindEmail";
		}	
		
		
		
	
		/**********************   중복검사  ***************/
		/** 아이디 중복검사 ( 비동기 요청 ) 
		 * @return
		 */
		
		@ResponseBody // 응답 본문으로 ( fetch ) 돌려보냄
		@GetMapping("checkWorkerId") //
		public int checkId(@RequestParam("workerId") String workerId) {
			
			
			return service.checkId(workerId); // 0 or 1
		}
		
		/** 이메일 중복검사 ( 비동기 요청 ) 
		 * @return
		 */
		
		@ResponseBody // 응답 본문으로 ( fetch ) 돌려보냄
		@GetMapping("checkEmail") // Get요청 /member/checkEmail
		public int checkEmail(@RequestParam("memberEmail") String memberEmail) {
			
			
			return service.checkEmail(memberEmail); // 0 or 1
		}
		
		/** 닉네임 중복 검사
		 * @param memberNickname
		 * @return 중복 1, 아니면 0 
		 */
		@ResponseBody
		@GetMapping("checkNickname")
		public int checkNickname(@RequestParam("workerNickname") String workerNickname) {
			
			return service.checkNickname(workerNickname); 
		}
	
}

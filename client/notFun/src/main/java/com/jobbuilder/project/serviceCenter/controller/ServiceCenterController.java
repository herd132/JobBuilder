package com.jobbuilder.project.serviceCenter.controller;

import java.net.http.HttpRequest;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.jobbuilder.project.employer.model.dto.Employer;
import com.jobbuilder.project.serviceCenter.model.dto.InquiryOneOnOne;
import com.jobbuilder.project.serviceCenter.model.dto.ServiceCenter;
import com.jobbuilder.project.serviceCenter.model.service.ServiceCenterService;
import com.jobbuilder.project.worker.model.dto.Worker;

import jakarta.mail.Session;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
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
	public String noticeSelectList(@RequestParam(value="cp", required = false, defaultValue = "1") int cp,
						Model model) {
		
		// 조회 서비스 호출 후 결과 반환
		Map<String, Object> map = service.serviceCenterList(1, cp);
		
		// model에 반환 받은 값을 등록
		model.addAttribute("serviceCenterList", map.get("serviceCenterList"));
		model.addAttribute("pagination", map.get("pagination"));
		
		
		return "serviceCenter/notice";
	}
	
	// 공지사항 상세조회
	@GetMapping("notice/{serviceCenterNo:[0-9]+}")
	public String noticeSelect( @PathVariable("serviceCenterNo") int serviceCenterNo,
							  Model model,
							  RedirectAttributes ra,
							  HttpServletRequest req,
							  HttpServletResponse resp) {
		// 게시글 상세 조회 서비스 호출
		
		// 1) Map으로 전달할 파라미터 묶기
		Map<String, Integer> map = new HashMap<>();
		
		map.put("serviceCenterNo", serviceCenterNo);
		
		// 2) 서비스 호출
		ServiceCenter serviceCenter = service.selectOne(map);
		
		String path = null;
		
		if(serviceCenter == null ) {
			path = "redirect:/serviceCenter/notice"; // 목록 재요청
			ra.addFlashAttribute("message", "게시글이 존재하지 않습니다");
		} else {
			/* --------------------- 쿠키를 이용한 조회 수 증가 ----------------------------- */
			
				
			// 요청에 담겨있는 모든 쿠키 얻어오기
			Cookie[] cookies = req.getCookies();
			
			Cookie c = null;
			
			for(Cookie temp : cookies) {
				
				if(temp.getName().equals("serviceCenterNo")) {
					c = temp;
					break;
				}
			}
			
			int result = 0; // 조회수 증가 결과를 저장할 변수
			
			if(c == null) {
				
				c = new Cookie("serviceCenterNo", "[" + serviceCenterNo +"]");
				result = service.updateReadCount(serviceCenterNo);
				
			} else {
				
				// 현재 글을 처음 읽는 경우
				if(c.getValue().indexOf("[" + serviceCenterNo +"]") == -1) {
					
					// 해당 글 번호를 쿠키에 누적 + 서비스 호출
					c.setValue(c.getValue() + "[" + serviceCenterNo + "]");
					// [2][30][400][2000][4000][20003]
					result = service.updateReadCount(serviceCenterNo);
				}
				
			}
			
			// 조회 수 증가 성공 / 조회 성공 시
			if( result > 0 ) {
				
				// 먼저 조회된 board의 readCount 같은
				// result 값을 다시 세팅
				serviceCenter.setServiceCenterReadCount(result);
				
				// 쿠키 적용 경로 설정
				c.setPath("/");		// "/" 이하 경로 요청 시 쿠키 서버로 전달
				
				// 쿠키 수명 지정
				// 현재 시간을 얻어오기
				LocalDateTime now = LocalDateTime.now();
				
				// 다음 날 자정 지정
				LocalDateTime nextDayMidni = now.plusDays(1).withHour(0).withMinute(0).withSecond(0).withNano(0);
				
				// 다음 날 자정까지 남은 시간 계산(초단위)
				long secondsUntilNextDay = Duration.between(now, nextDayMidni).getSeconds();
				
				// 쿠키 수명 설정
				c.setMaxAge((int)secondsUntilNextDay);
				
				resp.addCookie(c); // 응답 객체를 이용해서 클라이언트에게 전달
			}
				
			
			/* ----------------------------- 쿠키를 이용한 조회 수 증가 끝 ----------------------------- */
			
			// 조회 결과가 있는 경우
			path ="serviceCenter/detail"; // boardDetail.html로 forward
			
			// board - 게시글 일반 내용 + imageList + commentList
			model.addAttribute("serviceCenter", serviceCenter);
			
		}
		
		return path;
	}

	// FAQ로 이동
	@GetMapping("faq")
	public String faq(@RequestParam(value="cp", required = false, defaultValue = "1") int cp,
			Model model) {
		
		// 조회 서비스 호출 후 결과 반환
		Map<String, Object> map = null;
		
		map = service.serviceCenterList(2, cp);
		
		// model에 반환 받은 값을 등록
		model.addAttribute("serviceCenterList", map.get("serviceCenterList"));
		model.addAttribute("pagination", map.get("pagination"));
		
		log.debug("serviceCenterList : " + map.get("serviceCenterList"));
		log.debug("pagination : " + map.get("pagination"));

		return "serviceCenter/FAQ";
	}
	
	// 문의 내역으로 이동
	@GetMapping("inquiry")
	public String inquiry() {
		return "serviceCenter/inquiry";
	}
	
	/** 문의사항 내역 리스트 비동기 조회
	 * @param cp
	 * @return
	 */
	@GetMapping("selectInquiryList")
	@ResponseBody
	public Map<String, Object> selectInquiryList(@RequestParam("cp") int cp,
													HttpServletRequest req) {
		HttpSession session = req.getSession();
		int memberNo = 0;

    	if (session.getAttribute("loginWorker") != null) memberNo = ((Worker)session.getAttribute("loginWorker")).getMemberNo();
    	if (session.getAttribute("loginEmployer") != null) memberNo = ((Employer)session.getAttribute("loginEmployer")).getMemberNo();
    	
		Map<String, Object> map = service.selectInquiryList(memberNo, cp);
		return map;
	}
	
	/** 문의 보내기
	 * @param images
	 * @param map
	 * @return
	 */
	@PutMapping("inquirysInsert")
	@ResponseBody
	public int inquiryInsert( @RequestPart(value = "images", required = false) List<MultipartFile> images,
								@RequestPart("inquiry") InquiryOneOnOne inquiry,
								HttpServletRequest req) throws Exception{
		
		HttpSession session = req.getSession();

    	if (session.getAttribute("loginWorker") != null) inquiry.setMemberNo(((Worker)session.getAttribute("loginWorker")).getMemberNo());
    	if (session.getAttribute("loginEmployer") != null) inquiry.setMemberNo(((Employer)session.getAttribute("loginEmployer")).getMemberNo());
		return service.inquiryInsert(images, inquiry);
	}
	
}

package com.jobbuilder.project.chatting.controller;

import java.util.Enumeration;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.SessionAttribute;
import org.springframework.web.bind.annotation.SessionAttributes;

import com.jobbuilder.project.chatting.model.dto.ChattingRoom;
import com.jobbuilder.project.chatting.model.dto.Message;
import com.jobbuilder.project.chatting.model.service.ChattingService;
import com.jobbuilder.project.counsel.model.dto.Counselor;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Controller
@RequestMapping("chat")
@RequiredArgsConstructor
@Slf4j
@SessionAttributes("loginCounselor")
public class ChattingController {
	
	private final ChattingService service;
	
	@GetMapping("/main")
	public String chattingMain(@SessionAttribute(name = "loginCounselor", required = false) Counselor loginCounselor,
							Model model) {
		
		if(loginCounselor == null ) {
			return "redirect:/counsel/login";
		}
		
		List<ChattingRoom> roomList = service.selectRoomList(loginCounselor.getMemberNo());
        model.addAttribute("roomList", roomList);
		
		return "chatting/counselMain";
	}
	
	// 채팅창 목록 조회 - 비동기
	@GetMapping("selectMessage")
	@ResponseBody
	public List<Message> selectMessageList(@RequestParam Map<String, Integer> paramMap) {
		return service.selectMessageList(paramMap);
	}
	
	// 메세지 조회 - 비동기
	@GetMapping("roomList")
	@ResponseBody
	public List<ChattingRoom> selectRoomList(@SessionAttribute("loginCounselor") Counselor loginCounselor) {
		return service.selectRoomList(loginCounselor.getMemberNo());
	}
	
	// 채팅 읽음 표시 - 비동기
    @PutMapping("updateReadFlag")
    @ResponseBody
    public int updateReadFlag(@RequestBody Map<String, Integer> paramMap) {
        return service.updateReadFlag(paramMap);
    }
    
    
    /** 채팅봇 이용 유저 판가름 하기 위해 작성 로그인후 이용 가능할겁니다.
     * @param request
     * @return
     */
    @ResponseBody
    @GetMapping("loginCheck")
    public int loginCheck(HttpServletRequest request ) {
    	
    	HttpSession session = request.getSession();
    	
    	if (session.getAttribute("loginWorker") != null || session.getAttribute("loginEmployer") != null) {
    		return 1;
    	}
    	
    	return 0;
    }
 

}
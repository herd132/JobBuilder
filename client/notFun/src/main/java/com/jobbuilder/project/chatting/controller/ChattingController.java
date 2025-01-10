package com.jobbuilder.project.chatting.controller;

import java.util.Enumeration;
import java.util.HashMap;
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
import com.jobbuilder.project.employer.model.dto.Employer;
import com.jobbuilder.project.worker.model.dto.Worker;

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
	
	@GetMapping("bot")
	public String chatBot() {
		return "chatting/chatbot";
	}
	
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
    
    // 채팅방 입장(없으면 생성) - 비동기
    @GetMapping("enter")
    @ResponseBody
    public Map<String, Integer> chattingEnter( HttpServletRequest request) {
     
        Map<String, Integer> map = new HashMap<>();
    	HttpSession session = request.getSession();
    	int memberNo = 0; 
        
    	if (session.getAttribute("loginWorker") != null) memberNo = ((Worker)session.getAttribute("loginWorker")).getMemberNo();
    	if (session.getAttribute("loginEmployer") != null) memberNo = ((Employer)session.getAttribute("loginEmployer")).getMemberNo();
    	
        map.put("loginMemberNo", memberNo);
        
        // 채팅방번호 체크 서비스 호출 및 반환(기존 생성된 방이 있는지)
        int chattingRoomNo = service.checkChattingRoomNo(map);

    	log.debug("chattingRoomNo : " + chattingRoomNo);
        // 반환받은 채팅방번호가 0(없다)이라면 생성하기
        if(chattingRoomNo == 0) {
        	log.debug("map : " + map);
        	chattingRoomNo = service.createChattingRoom(map);
        	map.put("chattingRoomNo", chattingRoomNo);
        }
        
        return map;
    }
    
    // 상담 종료
    @PutMapping("counselingEnd")
    @ResponseBody
    public int counselingEnd(@RequestBody Map<String, Object> map) {
    	
    	return service.counselingEnd(map);
    }
    
    @GetMapping("chatBotMessgeList")
    @ResponseBody
    public List<Map<String, String>> chatBotMessgeList(HttpServletRequest request) {

    	HttpSession session = request.getSession();
    	int authority = 0; 
        
    	if (session.getAttribute("loginWorker") != null) authority = session.getAttribute("loginWorker") != null ? 2 : 0 ;
    	if (session.getAttribute("loginEmployer") != null) authority = session.getAttribute("loginEmployer") != null ? 3 : 0;
    	
    	return service.chatBotMessgeList(authority);
    }
 
}
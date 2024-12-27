package com.jobbuilder.project.chatting.controller;

import java.util.List;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.SessionAttribute;
import org.springframework.web.bind.annotation.SessionAttributes;

import com.jobbuilder.project.chatting.model.dto.ChattingRoom;
import com.jobbuilder.project.chatting.model.dto.Message;
import com.jobbuilder.project.chatting.model.service.ChattingService;
import com.jobbuilder.project.counsel.model.dto.Counselor;

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
	
//	@GetMapping("selectMessage")
//	@ResponseBody
//	public List<Message> selectMessageList() {
////		return service.selectMessageList;
//	}

}
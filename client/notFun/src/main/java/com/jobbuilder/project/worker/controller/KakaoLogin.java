package com.jobbuilder.project.worker.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import com.jobbuilder.project.worker.api.KakaoApi;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Controller
public class KakaoLogin {
	 private final KakaoApi kakaoApi;

	    @GetMapping("/login")
	    public String loginForm(Model model){
//	        model.addAttribute("kakaoApiKey", kakaoApi.getKakaoApiKey());
//	        model.addAttribute("redirectUri", kakaoApi.getKakaoRedirectUri());
	        return "worker/workerLogin";
	    }
}

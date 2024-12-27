package com.jobbuilder.project.worker.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/login")
public class KakaoLoginPageController {

    @Value("${kakao.api_key}")
    private String api_key;

    @Value("${kakao.redirect_uri}")
    private String redirect_uri;

    @GetMapping("/page")
    public String loginPage(Model model) {
        String location = "https://kauth.kakao.com/oauth/authorize?response_type=code&client_id="+api_key+"&redirect_uri="+redirect_uri;
        model.addAttribute("location", location);

        return "login";
    }
}
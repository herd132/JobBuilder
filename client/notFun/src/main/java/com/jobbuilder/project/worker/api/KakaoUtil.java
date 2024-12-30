package com.jobbuilder.project.worker.api;

import java.util.HashMap;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.stereotype.Component;
@Component
@PropertySource("classpath:/config.properties")
public class KakaoUtil {
	@Value("${spring.kakao.auth.client}")
	    private String client;
	@Value("${spring.kakao.auth.redirect}")
	    private String redirect;
    
    //인가 코드를 받아서 accessToken을 반환
	public String getAccessToken(String code){
		return code;}
    //accessToken을 받아서 UserInfo 반환
	public HashMap<String, Object> getUserInfo(String accessToken) {
		return null;}
    //accessToken을 받아서 로그아웃 시키는 메서드
	public void kakaoLogout(String accessToken) {}
}

package com.jobbuilder.project.worker.api;

import java.util.HashMap;
public class KakaoUtil {
    
    //인가 코드를 받아서 accessToken을 반환
	public String getAccessToken(String code){
		return code;}
    //accessToken을 받아서 UserInfo 반환
	public HashMap<String, Object> getUserInfo(String accessToken) {
		return null;}
    //accessToken을 받아서 로그아웃 시키는 메서드
	public void kakaoLogout(String accessToken) {}
}

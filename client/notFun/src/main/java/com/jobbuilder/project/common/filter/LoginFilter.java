package com.jobbuilder.project.common.filter;

import java.io.IOException;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

/* Filter : 요청, 응답 시 걸러내거나 추가할 수 있는 객체
 * 
 * [필터 클래스 생성 방법]
 * 1. jakarta.servlet.Filter 인터페이스 상속 받기
 * 2. doFilter() 메서드 오버라이딩
 * 
 * */

// 로그인이 되어 있지 않는 경우 특정 페이지로 돌아가게 함
public class LoginFilter implements Filter{
	
	// 필터 동작을 정의하는 메서드
	@Override
	public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
			throws IOException, ServletException {
		
		// ServletRequest : HttpServletRequest 의 부모 타입
		// ServletResponse : HttpServletResponse 의 부모 타입
		
		// Session 필요함 -> loginMember 가 session 에 담김
		
		// HTTP 통신이 가능한 형태(자식형태)로 다운캐스팅
		HttpServletRequest req = (HttpServletRequest) request;
		HttpServletResponse resp = (HttpServletResponse) response;
		
		//-------- 게시판에 프로필사진 안 뜨는 문제해결 위해 추가작성 시작 ------
		// 현재 요청의 URI를 가져옴
		String path = req.getRequestURI();
		
		// 요청 URI가 "/myPageEmployer/profile/" 로 시작하는지 확인
		if(path.startsWith("/myPageEmployer/profile/")) {
			chain.doFilter(request, response);		// 필터를 통과하도록 함
			return;									// 필터 통과 후 아래코드 수행하지 않도록 함
		}
		
		// 요청 URI가 "/myPageWorker/profile/" 로 시작하는지 확인
		if(path.startsWith("/myPageWorker/profile/")) {
			chain.doFilter(request, response);		// 필터를 통과하도록 함
			return;									// 필터 통과 후 아래코드 수행하지 않도록 함
		}
		
		//-------- 추가작성 여기까지(241115 오후 2시10분) -----------------------
		

	}
	
}

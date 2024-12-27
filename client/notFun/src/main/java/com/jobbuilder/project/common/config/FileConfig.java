package com.jobbuilder.project.common.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.servlet.MultipartConfigFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.util.unit.DataSize;
import org.springframework.web.multipart.MultipartResolver;
import org.springframework.web.multipart.support.StandardServletMultipartResolver;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import jakarta.servlet.MultipartConfigElement;

@Configuration
@PropertySource("classpath:/config.properties")
public class FileConfig implements WebMvcConfigurer{
	
	/* ********** 필드 ********** */
	// ----- 파일 크기 공통 설정
	@Value("${spring.servlet.multipart.file-size-threshold}")
	private long fileSizeThreshold;					// 파일 업로드 임계값
	
	@Value("${spring.servlet.multipart.max-request-size}")
	private long maxRequestSize;					// HTTP 요청당 파일 최대 크기
	
	@Value("${spring.servlet.multipart.max-file-size}")
	private long maxFileSize;						// 개별 파일당 최대 크기
	
	@Value("${spring.servlet.multipart.location}")
	private String location;						// 임계값 초과 시 파일의 임시 저장 경로
	
	// ----- 알바생 프로필 사진 설정
	@Value("${my.worker.profile.resource-handler}")
	private String myWorkerProfileResourceHandler;	// 알바생 프로필 이미지 요청 주소
	
	@Value("${my.worker.profile.resource-location}")
	private String myWorkerProfileResourceLocation;	// 알바생 프로필 요청 시 연결할 서버폴더 경로
	
	// ----- 게시글 작성 시 사진 설정
	@Value("${my.board.resource-handler}")
	private String boardResourceHandler;			// 게시글 이미지 요청 주소
	
	@Value("${my.board.resource-location}")
	private String boardResourceLocation;			// 게시글 이미지 요청 시 연결할 서버폴더 경로
	
	// ----- 사업장 이미지 사진 설정
	@Value("${my.business.resource-handler}")
	private String myBusinessResourceHandler;		// 사업장 이미지 요청 주소
	
	@Value("${my.business.resource-location}")
	private String myBusinessResourceLocation;		// 사업장 이미지 요청 시 연결한 서버폴더 경로

	// ----- 채용공고 이미지 사진 설정
	@Value("${my.recruitment.resource-handler}")
	private String myRecruitmentResourceHandler;	// 채용공고 이미지 요청 주소
	
	@Value("${my.recruitment.resource-location}")
	private String myRecruitmentResourceLocation;	// 채용공고 이미지 요청 시 연결한 서버폴더 경로
	
	// ----- 문의글 이미지 사진 설정
	@Value("${my.inquery.resource-handler}")
	private String inqueryResourceHandler;			// 문의글 이미지 요청 주소
	
	@Value("${my.inquery.resource-location}")
	private String inqueryResourceLocation;			// 문의글 이미지 요청 시 연결한 서버폴더 경로
	
	
	/* ********** 메서드 ********** */
	@Override	// 요청 주소에 따른 서버 컴퓨터의 접근 경로 설정
	public void addResourceHandlers(ResourceHandlerRegistry registry) {
		
		// 알바생 프로필 이미지 관련 경로 설정
		registry.addResourceHandler(myWorkerProfileResourceHandler)
		.addResourceLocations(myWorkerProfileResourceLocation);
		
		// 게시글 프로필 이미지 관련 경로 설정
		registry.addResourceHandler(boardResourceHandler)
		.addResourceLocations(boardResourceLocation);
		
		// 사업장 프로필 이미지 관련 경로 설정
		registry.addResourceHandler(myBusinessResourceHandler)
		.addResourceLocations(myBusinessResourceLocation);
		
		// 채용공고 프로필 이미지 관련 경로 설정
		registry.addResourceHandler(myRecruitmentResourceHandler)
		.addResourceLocations(myRecruitmentResourceLocation);
		
		// 문의글 프로필 이미지 관련 경로 설정
		registry.addResourceHandler(inqueryResourceHandler)
		.addResourceLocations(inqueryResourceLocation);
	}
	
	/* ***** MultipartResolver 설정 ***** */
	@Bean	
	public MultipartConfigElement configElement() {
		
		// MultipartConfigElement
		// 파일 업로드를 처리하는데 사용되는 MultipartConfigElement를 구성하고 반환
		// 파일 업로드를 위한 구성 옵션을 설정하는데 사용
		// 업로드 파일의 최대크기, 메모리에서의 임시 저장경로 등 설정 가능
		
		MultipartConfigFactory factory = new MultipartConfigFactory();
		factory.setFileSizeThreshold(DataSize.ofBytes(fileSizeThreshold));
		factory.setMaxRequestSize(DataSize.ofBytes(maxRequestSize));
		factory.setMaxFileSize(DataSize.ofBytes(maxFileSize));
		factory.setLocation(location);
		
		return factory.createMultipartConfig();
	}
	
	@Bean
	public MultipartResolver multipartResolver() {
		
		// MultipartResolver : MultipartFile 을 처리해주는 해결사
		// -> 클라이언트로부터 받은 multipart 요청을 처리하고,
		//    이 중 업로드된 파일을 추출하여 MultipartFile 객체로 제공하는 역할
		
		StandardServletMultipartResolver multipartResolver = new StandardServletMultipartResolver();
		
		return multipartResolver;
	}
}

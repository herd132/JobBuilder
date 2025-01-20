package com.jobbuilder.project.payment.model.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import com.jobbuilder.project.employer.model.dto.Employer;
import com.jobbuilder.project.payment.model.dto.Membership;
import com.jobbuilder.project.payment.model.dto.Payment;
import com.jobbuilder.project.payment.model.mapper.PaymentMapper;

import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
@Slf4j
@PropertySource("classpath:/config.properties")
public class PaymentServiceImpl implements PaymentService {

	private final PaymentMapper mapper;
	private final RestTemplate restTemplate;

	@Value("${portone.imp-key}")
	private String impKey;

	@Value("${portone.imp-secret}")
	private String impSecret;

	@Override
	public List<Employer> getEmployerNo(int memberNo) {
		return mapper.getEmployerNo(memberNo);
	}

	@Override
	public List<Membership> getMembershipDetails(int employerNo) {
		log.debug("Fetching membership details for employerNo: {}", employerNo);
		return mapper.getMembershipDetails(employerNo);
	}

	@Override
	public List<Payment> getPaymentList(int employerNo) {
		log.debug("Fetching membership details for employerNo: {}", employerNo);
		return mapper.getPaymentList(employerNo);
	}

	@Data
	private class AccessToken {
	    private String token;       // 액세스 토큰 값
	    private long expiredAt;     // 토큰 만료 시간 (Unix Time)

	    // 만료 여부 체크
	    public boolean isExpired() {
	        long currentTime = System.currentTimeMillis() / 1000; // 현재 시간 (초 단위)
	        return expiredAt < currentTime;
	    }
	}

	
	@Override
	public boolean verifyPayment(String impUid, String merchantUid, int amount, int employerNo) {
	    log.debug("impKey: {}", impKey);
	    log.debug("impSecret: {}", impSecret);
	    log.debug("impUid: {}", impUid);
	    log.debug("merchantUid: {}", merchantUid);
	    
	    try {
	        // 1. 결제 로그 저장
	        String status = "검증중";

	        Map<String, Object> paramMap = new HashMap<>();
	        paramMap.put("impUid", impUid);
	        paramMap.put("merchantUid", merchantUid);
	        paramMap.put("amount", amount);
	        paramMap.put("employerNo", employerNo);
	        paramMap.put("status", status);

	        try {
	            mapper.insertPaymentLog(paramMap);
	        } catch (Exception logEx) {
	            log.error("로그 기록 중 오류 발생: {}", logEx.getMessage(), logEx);
	        }

	        // 2. 토큰 발급 요청 및 관리
	     // 2. 토큰 발급 요청 및 관리
	        AccessToken accessToken = new AccessToken();
	        String tokenUrl = "https://api.iamport.kr/users/getToken";

	        // HTTP 헤더 설정
	        HttpHeaders tokenHeaders = new HttpHeaders();
	        tokenHeaders.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

	        // URL 인코딩된 요청 바디 생성
	        MultiValueMap<String, String> tokenBody = new LinkedMultiValueMap<>();
	        tokenBody.add("imp_key", impKey); // REST API 키
	        tokenBody.add("imp_secret", impSecret); // REST API Secret

	        // 요청 엔터티 생성
	        HttpEntity<MultiValueMap<String, String>> tokenRequest = new HttpEntity<>(tokenBody, tokenHeaders);

	        try {
	            // REST API 요청
	            ResponseEntity<Map> tokenResponse = restTemplate.exchange(
	                tokenUrl,
	                HttpMethod.POST,
	                tokenRequest,
	                Map.class
	            );

	            // 응답 상태 확인
	            if (tokenResponse.getStatusCode() != HttpStatus.OK || tokenResponse.getBody() == null) {
	                status = "토큰 HTTP 요청 실패 또는 응답 없음";
	                paramMap.put("status", status);
	                mapper.insertPaymentLog(paramMap);
	                return false;
	            }

	            // 응답 바디에서 토큰 값 추출
	            Map<String, Object> tokenResponseBody = tokenResponse.getBody();
	            if ((int) tokenResponseBody.get("code") != 0) {
	                status = "토큰 API 응답 실패: 코드 불일치";
	                paramMap.put("status", status);
	                mapper.insertPaymentLog(paramMap);
	                return false;
	            }

	            // 토큰 값과 만료 시간 저장
	            Map<String, Object> responseData = (Map<String, Object>) tokenResponseBody.get("response");
	            accessToken.setToken((String) responseData.get("access_token"));
	            accessToken.setExpiredAt(((Number) responseData.get("expired_at")).longValue());

	            if (accessToken.isExpired()) {
	                status = "토큰 만료됨";
	                paramMap.put("status", status);
	                mapper.insertPaymentLog(paramMap);
	                return false;
	            }

	        } catch (Exception e) {
	            log.error("토큰 요청 중 예외 발생: {}", e.getMessage(), e);
	            status = "토큰 요청 중 시스템 오류";
	            paramMap.put("status", status);
	            mapper.insertPaymentLog(paramMap);
	            return false;
	        }


	        // 3. 단건 조회 API 호출
	        String paymentUrl = "https://api.iamport.kr/payments/" + impUid;
	        HttpHeaders paymentHeaders = new HttpHeaders();
	        paymentHeaders.set("Authorization", accessToken.getToken());

	        HttpEntity<String> paymentRequest = new HttpEntity<>(paymentHeaders);
	        ResponseEntity<Map> paymentResponse = restTemplate.exchange(paymentUrl, HttpMethod.GET, paymentRequest,
	                Map.class);

	        if (paymentResponse.getStatusCode() != HttpStatus.OK || paymentResponse.getBody() == null) {
	            status = "단건 HTTP 요청 실패 또는 응답 없음";
	            paramMap.put("status", status);
	            mapper.insertPaymentLog(paramMap);
	            return false;
	        }

	        Map<String, Object> paymentResponseBody = paymentResponse.getBody();
	        if ((int) paymentResponseBody.get("code") != 0) {
	            status = "단건 조회 실패: 코드 불일치";
	            paramMap.put("status", status);
	            mapper.insertPaymentLog(paramMap);
	            return false;
	        }

	        Map<String, Object> paymentData = (Map<String, Object>) paymentResponseBody.get("response");
	        int paidAmount = (int) paymentData.get("amount");

	        if (paidAmount != amount) {
	            status = "검증 실패: 금액 불일치";
	            paramMap.put("status", status);
	            mapper.insertPaymentLog(paramMap);
	            return false;
	        }

	        // 검증 성공 처리
	        status = "검증 성공";
	        paramMap.put("status", status);
	        mapper.insertPaymentLog(paramMap);

	        return true;

	    } catch (Exception e) {
	        // 예외 처리 및 로그 기록
	        String status = "검증 실패: 시스템 오류";
	        Map<String, Object> paramMap = new HashMap<>();
	        paramMap.put("impUid", impUid);
	        paramMap.put("merchantUid", merchantUid);
	        paramMap.put("amount", amount);
	        paramMap.put("employerNo", employerNo);
	        paramMap.put("status", status);

	        try {
	            mapper.insertPaymentLog(paramMap);
	        } catch (Exception logEx) {
	            log.error("오류 로그 기록 중 추가 오류 발생: {}", logEx.getMessage(), logEx);
	        }

	        log.error("결제 검증 중 오류 발생: {}", e.getMessage(), e);
	        return false;
	    }
	}


	@Override
	public void savePayment(Payment payment, List<Integer> validMembershipNumbers, int emptyMembershipCount,
			List<Membership> oldMembershipList, List<Membership> newMembershipList) {
		// 1단계: 결제 정보 저장
		log.info("Saving payment: {}", payment);
		mapper.savePayment(payment); // paymentNo 설정

		boolean processed = false; // 처리 여부 플래그

		// 2단계: 기존 멤버십 연결
		if (validMembershipNumbers != null && !validMembershipNumbers.isEmpty()) {
			processed = true; // 처리 상태 기록
			int i = 0; // 반복용 기준 초기화

			// 2-1단계: 기존맴버십일 경우 맴버십&결제 해소테이블의 정보를 담음
			for (Integer membershipNo : validMembershipNumbers) {
				log.info("Linking existing membershipNo {} to paymentNo {}: {}", membershipNo, payment.getPaymentNo(),
						payment);
				// 기존 멤버십 연결
				payment.setMembershipNo(membershipNo);
				mapper.connectionPayment(payment); // PAYMENT_MEMBERSHIP 연결
			}

			// 2-2단계: 기존맴버십일 경우 결제 상세정보 테이블에 정보를 담음
			for (i = 0; i < validMembershipNumbers.size(); i++) {
				log.info("Linking2 paymentNo {}: {}", payment.getPaymentNo(), payment);
				Membership membership = oldMembershipList.get(i);
				membership.setPaymentNo(payment.getPaymentNo()); // 1단계실시한 결제번호 부여
				mapper.connectionPaymentType(membership); // PAYMENT_Type 연결
			}

			i = 0;
			// 2-3단계: 기존맴버십일 경우 업데이트
			for (Integer membershipNo : validMembershipNumbers) {
				log.info("Linking3 existing membershipNo {} to paymentNo {}: {}", membershipNo, payment.getPaymentNo(),
						payment);
				Membership membership = oldMembershipList.get(i);
				i++;
				// 기존 멤버십 연결
				membership.setMembershipNo(membershipNo);
				mapper.updateMembership(membership);
			}

		}

		// 3단계: 신규 멤버십 생성 및 연결
		if (emptyMembershipCount > 0) {
			processed = true; // 처리 상태 기록
			for (int i = 0; i < emptyMembershipCount; i++) {
				Membership membership = newMembershipList.get(i); // 신규 멤버십 정보 가져오기
				log.info("Creating new membership: {}", membership);

				// 3-1 단계 신규 MEMBERSHIP 생성
				mapper.newMembership(membership);

				// 3-2 단계 생성된 membershipNo와 결제 연결 (2-1과 동일)
				log.info("Linking new membershipNo {} to paymentNo {}: {}", membership.getMembershipNo(),
						payment.getPaymentNo());

				payment.setMembershipNo(membership.getMembershipNo());

				mapper.connectionPayment(payment); // PAYMENT_MEMBERSHIP 연결

				membership.setPaymentNo(payment.getPaymentNo()); // 1단계실시한 결제번호 부여
				mapper.connectionPaymentType(membership);
			}
		}

		// 4단계: 골드맴버십과 플레가 공존 있을 경우 골드 비활성화 (업그레이드처리)

		// 골드,플레 공존 조회
		int result = mapper.getMembershipUpgradeCount(payment.getEmployerNo());

		// 결과가 있다면 골드 비활성화
		if (result > 1) {
			mapper.updateOldMemberships(payment.getEmployerNo());
		}

		// 조건이 모두 충족되지 않았을 경우 예외를 던짐
		if (!processed) {
			throw new IllegalArgumentException("유효한 멤버십 번호도 없고 신규 멤버십 정보도 없습니다.");
		}

		log.info("Payment and membership linking completed for paymentNo: {}", payment.getPaymentNo());
	}

}

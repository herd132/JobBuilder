package com.jobbuilder.project.email.model.mapper;

import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface WookjaeEmailMapper {

	/** AUTH_KEY 에 기존 이메일 있는 경우 인증키 업데이트
	 * @param map(authKey, email)
	 * @return
	 * @author JWJ
	 */
	int updateAuthKey(Map<String, String> map);

	/** AUTH_KEY 에 기존 이메일 없는 경우 인증키 새로 삽입
	 * @param map(authKey, email)
	 * @return
	 * @author JWJ
	 */
	int insertAuthKey(Map<String, String> map);

	/** 인증번호 확인
	 * @param map(email, authKey)
	 * @return
	 * @author JWJ
	 */
	int checkAuthKey(Map<String, String> map);

}

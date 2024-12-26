package com.jobbuilder.project.counsel.model.service;

import java.util.Map;

import com.jobbuilder.project.counsel.model.dto.Counselor;

public interface CounselService {

	/** 상담가 로그인
	 * @param inputCounselor
	 * @return
	 */
	Counselor loginCounselor(Counselor inputCounselor);

}

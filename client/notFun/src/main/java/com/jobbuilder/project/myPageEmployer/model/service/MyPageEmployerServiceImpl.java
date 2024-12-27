package com.jobbuilder.project.myPageEmployer.model.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.jobbuilder.project.employer.model.dto.BusinessImg;
import com.jobbuilder.project.employer.model.dto.BusinessWorktype;
import com.jobbuilder.project.employer.model.dto.Employer;
import com.jobbuilder.project.myPageEmployer.model.mapper.MyPageEmployerMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
@Slf4j
public class MyPageEmployerServiceImpl implements MyPageEmployerService{

	/* ********** 필드 ********** */
	private final MyPageEmployerMapper mapper;
	
	/* ********** 메서드 ********** */
	@Override	// 고용주 1명의 사업장 리스트 얻어오기
	public List<Employer> selectBusinessList(int memberNo) {
		
		// employerNo, businessNickname, businessAddress, businessTel 얻어오기
		List<Employer> selectBusinessList = mapper.selectBusinessList(memberNo);
		if(selectBusinessList == null) return null;
		
		for(Employer employer: selectBusinessList) {
			List<BusinessWorktype> worktypeList = mapper.selectWorktype(employer.getEmployerNo());
			List<BusinessImg> imageList = mapper.selectImage(employer.getEmployerNo());
			
			employer.setBusinessWorktypeList(worktypeList);
			employer.setBusinessImgList(imageList);
			
			log.debug("employer : " + employer);
		}
		
		log.debug("selectBusinessList :" + selectBusinessList);
		
		return selectBusinessList;
	}
}

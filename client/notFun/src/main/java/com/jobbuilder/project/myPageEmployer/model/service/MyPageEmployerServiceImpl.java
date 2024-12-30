package com.jobbuilder.project.myPageEmployer.model.service;

import java.util.List;
import java.util.Map;

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
	
	@Override	// 사업장 정보 얻어오기
	public Employer getBusiness(int employerNo) {
		
		Employer business = mapper.getBusiness(employerNo);
		List<BusinessWorktype> businessWorktypeList = mapper.getBusinessWorktype(employerNo);
		
		String businessWorktype = "";
		
		for(int i=0; i<businessWorktypeList.size(); i++) {
			if(i != 0) businessWorktype += ", ";
			businessWorktype += businessWorktypeList.get(i).getWorktypeCategory();
		}
		
		business.setBusinessWorktype(businessWorktype);
		
		return business;
	}
	
	
	@Override	// 대분류 리스트 얻어오기
	public List<Map<String,String>> selectMajorCategory() {
		return mapper.selectMajorCategory();
	}
	
	@Override	// workType 가 일치한 소분류 업직종 불러오기
	public List<Map<String, String>> selectsubCategoryList(String workTypeNo) {
		return mapper.selectsubCategoryList(workTypeNo);
	}
}

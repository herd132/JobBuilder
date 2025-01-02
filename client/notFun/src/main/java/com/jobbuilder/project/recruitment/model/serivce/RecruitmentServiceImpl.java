package com.jobbuilder.project.recruitment.model.serivce;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.RowBounds;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.jobbuilder.project.employer.model.dto.Employer;
import com.jobbuilder.project.recruitment.model.dto.PaginationRecruitment;
import com.jobbuilder.project.recruitment.model.dto.Recruitment;
import com.jobbuilder.project.recruitment.model.mapper.RecruitmentMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
@Slf4j
public class RecruitmentServiceImpl implements RecruitmentService{

	/* ********** 필드 ********** */
	private final RecruitmentMapper mapper;
	
	
	/* ********** 메서드 ********** */

	/* ***** 공고 추가 페이지 이동 관련 ***** */
	@Override	// 사업장 정보 얻어오기
	public List<Employer> selectBusinessList(int memberNo) {
		return mapper.selectBusinessList(memberNo);
	}
	
	@Override	// 선호조건 리스트 불러오기
	public List<Map<String, String>> selectPreferredList() {
		return mapper.selectPreferredList();
	}
	
	@Override	// 복리후생 대분류 불러오기
	public List<Map<String, String>> selectSupportTitleList() {
		return mapper.selectSupportTitleList();
	}
	
	@Override	// 복리후생 소분류 불러오기
	public List<Map<String, String>> selectSubSupportList(String supportNo) {
		// TODO Auto-generated method stub
		return mapper.selectSubSupportList(supportNo);
	}
	
	
	/* ***** 공고 추가(post) 관련 ***** */
	@Override	// 공고 추가
	public int insertRecruitment(int memberNo, Recruitment addRecruitment, List<String> preferredList, List<String> supportList) {
		
		addRecruitment.setMemberNo(memberNo);
		
		int result = mapper.insertRecruitment(addRecruitment);
		if (result == 0) return 0;
		
		int recruitmentNo = addRecruitment.getRecruitmentNo();
		
		if (preferredList != null) {
			
			for(String preferredCategory : preferredList) {
				
				String preferredNo = mapper.selectPreferredNo(preferredCategory);
				
				Map<String, Object> recruitmentPreferredNoMap = new HashMap<>();
				recruitmentPreferredNoMap.put("recruitmentNo", recruitmentNo);
				recruitmentPreferredNoMap.put("preferredNo", preferredNo);
				
				result = mapper.insertRecruitmentPreferred(recruitmentPreferredNoMap);
			}
		}
		
		if (supportList != null) {
			
			for(String supportCategory : supportList) {
				
				String supportNo = mapper.selectSupportNo(supportCategory);
				
				Map<String, Object> recruitmentSupportNoMap = new HashMap<>();
				recruitmentSupportNoMap.put("recruitmentNo", recruitmentNo);
				recruitmentSupportNoMap.put("supportNo", supportNo);
				
				result = mapper.insertRecruitmentSupport(recruitmentSupportNoMap);
			}
		}
		
		return recruitmentNo;
	}
	
	
	/* ***** 공고글 목록 조회 관련 ***** */
	@Override	// 공고글 목록 전체 조회
	public Map<String, Object> selectRecruitmentList(int cp) {
		
		int listCount = mapper.getListCount();
		PaginationRecruitment paginationRecruitment = new PaginationRecruitment(cp, listCount);
		
		int limit = paginationRecruitment.getLimit();
		int offset = (cp -1) * limit;
		
		RowBounds rowBounds = new RowBounds(offset, limit);
		
		List<Recruitment> recruitmentList = mapper.selectRecruitmentList(rowBounds);
		/* 공고 목록에서 띄울 사항
		 * recruitmentNo, recruitmentTitle, businessName(join), 
		 * businessAddress(join) 가운데(앞쪽에서 2개만 ex 서울 관악구),
		 * salaryName(join), salaryMount, timeName(join)
		 * writeDate, recruitmentDeadline
		 * 
		 * */
		
		for(Recruitment recruitment: recruitmentList) {
			String[] addressArr = recruitment.getBusinessAddress().split("\\^\\^\\^");
			String address = null;
			
			if(addressArr.length >= 2) address = addressArr[1];
			else address = addressArr[0];
			
			addressArr = address.split(" ");
			address = addressArr[0] + " " + addressArr[1];
			
			recruitment.setBusinessAddress(address);
			
		}
		
		Map<String, Object> map = new HashMap<>();
		map.put("paginationRecruitment", paginationRecruitment);
		map.put("recruitmentList", recruitmentList);
		
		return map;
	}
	
	
	/* ***** 공고 상세 페이지 이동 관련 ***** */
	
	@Override	// 공고글 상세 조회
	public Recruitment selectOne(int recruitmentNo) {
		return mapper.selectOne(recruitmentNo);
	}
}

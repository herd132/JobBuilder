package com.jobbuilder.project.myPageEmployer.model.service;

import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.RowBounds;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.jobbuilder.project.board.model.dto.Board;
import com.jobbuilder.project.common.util.Utility;
import com.jobbuilder.project.employer.model.dto.BusinessImg;
import com.jobbuilder.project.employer.model.dto.BusinessWorktype;
import com.jobbuilder.project.employer.model.dto.Employer;
import com.jobbuilder.project.myPageEmployer.model.dto.RecruitmentResume;
import com.jobbuilder.project.myPageEmployer.model.mapper.MyPageEmployerMapper;
import com.jobbuilder.project.recruitment.model.dto.PaginationRecruitment;
import com.jobbuilder.project.recruitment.model.dto.Recruitment;
import com.jobbuilder.project.recruitment.model.dto.RecruitmentPreferred;
import com.jobbuilder.project.recruitment.model.dto.RecruitmentSupport;
import com.jobbuilder.project.resume.model.dto.CareerInfo;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
@Slf4j
public class MyPageEmployerServiceImpl implements MyPageEmployerService{

	/* ********** 필드 ********** */
	private final MyPageEmployerMapper mapper;
	private final BCryptPasswordEncoder bcrypt;
	
	@Value("${my.business.web-path}")
	private String myBusinessWebPath;
	
	@Value("${my.business.folder-path}")
	private String myBusinessFolderPath;
	
	/* ********** 메서드 ********** */
	
	/* ********** 내 정보 보기 페이지 관련 ********** */
	
	@Override	// 고용주 1명의 사업장 리스트 얻어오기
	public List<Employer> selectBusinessList(int memberNo) {
		
		// employerNo, businessNickname, businessAddress, businessTel 얻어오기
		List<Employer> selectBusinessList = mapper.selectBusinessList(memberNo);
		if(selectBusinessList == null) return null;
		
		for(Employer employer: selectBusinessList) {
			List<BusinessWorktype> worktypeList = mapper.selectWorktype(employer.getEmployerNo());
			String thumbnail = mapper.selectThumbNail(employer.getEmployerNo());
			
			String businessWorktype = "";
			
			for(int i=0; i<worktypeList.size(); i++) {
				if(i != 0) businessWorktype += ", ";
				businessWorktype += worktypeList.get(i).getWorktypeCategory();
			}
			
			employer.setBusinessWorktypeList(worktypeList);
			employer.setBusinessWorktype(businessWorktype);
			employer.setThumbnail(thumbnail);

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
	
	@Override	// 각 사업장의 공고목록 얻어오기
	public List<Recruitment> getRecruitmentList(int empNo) {
		return mapper.getRecruitmentList(empNo);
	}
	
	
	/* ********** 기본정보 수정 페이지 관련 ********** */
	@Override	// 비밀번호 확인
	public Employer checkPw(Map<String, String> bodyMap) {
		
		String memberPw = mapper.getPw(bodyMap.get("memberEmail"));
		
		if(!bcrypt.matches(bodyMap.get("memberPw"), memberPw)) return null;
		
		return mapper.getEmployer(bodyMap.get("memberEmail"));
	}
	
	
	/* ********** 비밀번호 변경 페이지 관련 ********** */
	
	@Override	// 비밀번호 확인
	public int checkCurrentPw(Employer loginEmployer, String currentPw) {
		
		String encOriginPw = mapper.getOriginPw(loginEmployer.getMemberNo());
		
		if(!bcrypt.matches(currentPw, encOriginPw)) return 0;
		
		return 1;
	}
	
	@Override	// 비밀번호 변경
	public int changePw(int memberNo, String newPw) {

		String encPw = bcrypt.encode(newPw);
		
		Map<String, Object> map = new HashMap<>();
		map.put("memberNo", memberNo);
		map.put("encPw", encPw);
		
		return mapper.changePw(map);
	}
	
	/* ********** 내가 쓴 공고 페이지 관련 ********** */
	
	@Override	// 내가 쓴 공고 목록 조회
	public Map<String, Object> selectRecruitmentList(int memberNo, int cp) {
		
		int listCount = mapper.getListCount(memberNo);
		
		PaginationRecruitment paginationRecruitment = new PaginationRecruitment(cp, listCount);
		
		int limit = paginationRecruitment.getLimit();
		int offset = (cp - 1) * limit;
		
		RowBounds rowBounds = new RowBounds(offset, limit);
		
		List<Recruitment> recruitmentList = mapper.selectRecruitmentList(memberNo, rowBounds);
		
		Map<String, Object> map = new HashMap<>();
		map.put("paginationRecruitment", paginationRecruitment);
		map.put("recruitmentList", recruitmentList);
		
		return map;
	}
	
	@Override	// 내가 쓴 공고 목록 중 검색결과 조회
	public Map<String, Object> searchRecruitmentList(Map<String, Object> paramMap, int cp) {
		
		int listCount = mapper.getSearchListCount(paramMap);
		
		PaginationRecruitment paginationRecruitment = new PaginationRecruitment(cp, listCount);
		
		int limit = paginationRecruitment.getLimit();
		int offset = (cp - 1) * limit;
		
		RowBounds rowBounds = new RowBounds(offset, limit);
		
		List<Recruitment> recruitmentList = mapper.searchRecruitmentList(paramMap, rowBounds);
		
		Map<String, Object> map = new HashMap<>();
		map.put("paginationRecruitment", paginationRecruitment);
		map.put("recruitmentList", recruitmentList);
		
		return map;
	}
	
	@Override	// 구인완료여부 변경 (내가 쓴 공고 페이지 내)
	public int changeRecruitComplete(Map<String, Object> badyMap) {
		return mapper.changeRecruitComplete(badyMap);
	}
	
	/* ********** 내가 쓴 글 페이지 관련 ********** */
	
	@Override	// 내가 쓴 글 목록 불러오기
	public List<Board> viewMyBoard(int memberNo, int cp) {
		int limit = 12;
		int offset = (cp - 1) * limit;
		RowBounds rowBounds =  new RowBounds(offset, limit);
		
		return mapper.viewMyBoard(memberNo, rowBounds);
	}
	
	/* ********** 사업장 추가 페이지 관련 ********** */
	
	@Override	// 대분류 리스트 얻어오기
	public List<Map<String,String>> selectMajorCategory() {
		return mapper.selectMajorCategory();
	}
	
	@Override	// workType 가 일치한 소분류 업직종 불러오기
	public List<Map<String, String>> selectsubCategoryList(String workTypeNo) {
		return mapper.selectsubCategoryList(workTypeNo);
	}
	
	@Override	// 사업장 지점명 중복검사
	public int checkBusinessNickname(Map<String, String> bodyMap) {
		return mapper.checkBusinessNickname(bodyMap);
	}
	
	@Override	// 사업장 전화번호 중복검사
	public int checkBusinessTel(Map<String, String> bodyMap) {
		return mapper.checkBusinessTel(bodyMap);
	}
	
	@Override	// 사업장 추가
	public int addBusiness(Employer loginEmployer, Employer addBusiness, List<String> subCategory,
			String[] businessAddress, List<MultipartFile> images) throws Exception {
		
		// 사업장 주소 처리(필수입력 사항)
		String address = String.join("^^^", businessAddress);
		addBusiness.setBusinessAddress(address);
		
		// loginEmployer에 들어있는 값 세팅 
		// memberNo, businessRegistrationNumber, businessName, membershipLevel, optionalAgreeFl
		addBusiness.setMemberNo(loginEmployer.getMemberNo());
		addBusiness.setBusinessRegistrationNumber(loginEmployer.getBusinessRegistrationNumber());
		addBusiness.setBusinessName(loginEmployer.getBusinessName());
		addBusiness.setOptionalAgreeFl(loginEmployer.getOptionalAgreeFl());

		
		int result = mapper.addBusiness(addBusiness);
		if(result == 0) return 0;
		
		int employerNo = addBusiness.getEmployerNo();
		
		// M:N 해소테이블(BUSINESS_WORKTYPE)에 값 대입
		for(String category : subCategory) {
			String worktypeNo = mapper.getWorktypeNo(category);
			
			Map<String, Object> map = new HashMap<>();
			map.put("employerNo", employerNo);
			map.put("worktypeNo", worktypeNo);
			
			result = mapper.addBusinessWorktype(map);
		}
		
		List<BusinessImg> uploadBusinessImgList = new ArrayList<>();
		
		for(int i=0; i<images.size(); i++) {
			
			if(!images.get(i).isEmpty()) {
				String originalName = images.get(i).getOriginalFilename();
				String rename = Utility.fileRename(originalName);
				
				BusinessImg img = BusinessImg.builder()
									.businessImgOriginalName(originalName)
									.businessImgRename(rename)
									.businessImgPath(myBusinessWebPath)
									.businessImgOrder(i)
									.employerNo(employerNo)
									.uploadFile(images.get(i))
									.build();
				
				uploadBusinessImgList.add(img);
			}
		}
		
		if(uploadBusinessImgList.isEmpty()) return employerNo;
		
		result = mapper.insertUploadList(uploadBusinessImgList);
		
		if(result == uploadBusinessImgList.size()) {
			for(BusinessImg img : uploadBusinessImgList) {
				img.getUploadFile().transferTo(new File(myBusinessFolderPath + img.getBusinessImgRename()));
			}
		} else {
			throw new RuntimeException();
		}
		
		return employerNo;
	}
	
	
	
	/* ********** 사업장 수정 페이지 관련 ********** */
	
	@Override	// 사업장 이미지정보 얻어오기
	public List<BusinessImg> getBusinessImgList(int employerNo) {
		return mapper.getBusinessImgList(employerNo);
	}
	
	@Override	// 사업장 수정
	public int updateBusiness(Employer updateBusiness, List<String> subCategory, String[] businessAddress,
			List<MultipartFile> images, String deleteOrderList) throws Exception {
		
		// EMPLOYER 테이블 수정
		String arr = null;
		if(businessAddress.length > 2) {
			arr = businessAddress[0] + "^^^" + businessAddress[1] + "^^^" + businessAddress[2];
		}
		updateBusiness.setBusinessAddress(arr);
		
		int result = mapper.updateBusiness(updateBusiness);
		
		if (result == 0) return 0;
		
		// M:M 테이블(업직종) 해소
		result = mapper.deleteBusinessWorktype(updateBusiness.getEmployerNo());
		
		for(String category : subCategory) {
			String worktypeNo = mapper.getWorktypeNo(category);
			
			Map<String, Object> map = new HashMap<>();
			map.put("employerNo", updateBusiness.getEmployerNo());
			map.put("worktypeNo", worktypeNo);
			
			result = mapper.addBusinessWorktype(map);
		}
		
		// 기존에 이미지 있었는데 삭제한 경우 BUSINESS_IMG 테이블 수정
		if(deleteOrderList != null && !deleteOrderList.equals("")) {
			Map<String, Object> map = new HashMap<>();
			map.put("deleteOrderList", deleteOrderList);
			map.put("employerNo", updateBusiness.getEmployerNo());
			
			result = mapper.deleteImage(map);
			
			if(result == 0) throw new RuntimeException();
		}
		
		// 선택한 파일이 존재할 경우 BUSINESS_IMG 테이블에 추가
		List<BusinessImg> uploadList = new ArrayList<>();
		for(int i=0; i<images.size(); i++) {
			
			if(!images.get(i).isEmpty()) {
				
				String originalName = images.get(i).getOriginalFilename();	// 원본명
				String rename = Utility.fileRename(originalName);			// 변경명
				
				BusinessImg img = BusinessImg.builder()
						.businessImgOriginalName(originalName)
						.businessImgRename(rename)
						.businessImgPath(myBusinessWebPath)
						.businessImgOrder(i)
						.employerNo(updateBusiness.getEmployerNo())
						.uploadFile(images.get(i))
						.build();
				
				uploadList.add(img);
				
				result = mapper.updateImage(img);
				if(result == 0) result = mapper.insertImage(img);
			}
			
			if(result == 0) throw new RuntimeException();
			
		}
		
		if(uploadList.isEmpty()) return result;
		
		for(BusinessImg img : uploadList) {
			img.getUploadFile().transferTo(new File(myBusinessFolderPath + img.getBusinessImgRename()));
		}
		
		return result;
	}
	
	
	/* ********** 사업장 삭제 관련 ********** */
	
	@Override	// 본점의 memberNo 얻어오기
	public int getMemberNo(int employerNo) {
		return mapper.getMemberNo(employerNo);
	}
	
	@Override	// 해당 사업장 삭제
	public int deleteBusiness(int employerNo) {
		return mapper.deleteBusiness(employerNo);
	}
	
	/* ********** 사업장 홍보 페이지 관련 ********** */
	
	
	
	/* ********** 제출된 이력서 보기 페이지 관련 ********** */
	
	@Override	// 공고에 제출된 이력서 조회
	public Map<List<Integer>, RecruitmentResume> viewResumes(int memberNo) {

		
		Map<List<Integer>, RecruitmentResume> viewReusmes = new HashMap<>();
		List<Integer> recuritmentNoList = mapper.getRecuritmentNoList(memberNo);
		
		for(Integer recruitmentNo : recuritmentNoList) {
			List<Integer> resumeNoList = mapper.getRusemeNoList(recruitmentNo);
			
			if(!resumeNoList.isEmpty()) {
				
				for(Integer resumeNo : resumeNoList) {
					
					List<Integer> recruitmentResumeNoList = new ArrayList<>();
					recruitmentResumeNoList.add(recruitmentNo);
					recruitmentResumeNoList.add(resumeNo);
					// [12,27] [12,41] [15,61] 
					
					Map<String, Integer> recruitmentResumeNoMap = new HashMap<>();
					recruitmentResumeNoMap.put("recruitmentNo", recruitmentNo);
					recruitmentResumeNoMap.put("resumeNo", resumeNo);
					
					RecruitmentResume recruitmentResume = mapper.getResume(recruitmentResumeNoMap);
					
					String careerFl = null;
					if(mapper.trueCareer(resumeNo) > 0) careerFl = "경력";
					else careerFl = "신입";
					
					recruitmentResume.setCareerFl(careerFl);
					
					log.debug("recruitmentResume : " + recruitmentResume);
					
					viewReusmes.put(recruitmentResumeNoList, recruitmentResume);
				}
			}
		}
			
		return viewReusmes;
	}
	
	
	@Override	// 무한스크롤 테스트용 공고에 제출된 이력서 조회
	public List<RecruitmentResume> viewResumesList(int memberNo, int cp) {
		
		int limit = 8;
		int offset = (cp - 1) * limit;
		RowBounds rowBounds =  new RowBounds(offset, limit);
		
		List<RecruitmentResume> recruitmentResumelist = mapper.viewResumesList(memberNo, rowBounds);
		
		for(RecruitmentResume recruitmentResume : recruitmentResumelist) {
			
			Map<String, Integer> recruitmentResumeNoMap = new HashMap<>();
			recruitmentResumeNoMap.put("recruitmentNo", recruitmentResume.getRecruitmentNo());
			recruitmentResumeNoMap.put("resumeNo", recruitmentResume.getResumeNo());
			
			String careerFl = null;
			
			if(mapper.trueCareer(recruitmentResume.getResumeNo()) > 0) careerFl = "경력";
			else careerFl = "신입";
			
			recruitmentResume.setCareerFl(careerFl);
			
		}
		
		return recruitmentResumelist;
	}
	
	
	
	
	
	@Override	// 해당 공고에 제출된 이력서 보기
	public RecruitmentResume viewRecruitResume(int recruitmentNo, int resumeNo) {
		
		Map<String, Integer> recruitmentResumeNoMap = new HashMap<>();
		recruitmentResumeNoMap.put("recruitmentNo", recruitmentNo);
		recruitmentResumeNoMap.put("resumeNo", resumeNo);
		
		RecruitmentResume recruitmentResume = mapper.viewRecruitResume(recruitmentResumeNoMap);
		
		recruitmentResume.setWorktypeList(mapper.getRecruitmentWorktypeList(recruitmentNo));
		recruitmentResume.setResumeJobtypeList(mapper.getResumeJobtypeList(resumeNo));
		recruitmentResume.setHopeDaysTimeList(mapper.getHopeDaysTimeList(resumeNo));
		recruitmentResume.setHopeAddressList(mapper.getHopeAddressList(resumeNo));
		recruitmentResume.setHopeWorkTypeList(mapper.getHopeWorkTypeList(resumeNo));
		
		List<CareerInfo> careerInfoList = mapper.getCareerInfoList(resumeNo);
		recruitmentResume.setCareerInfoList(careerInfoList);
		
		String careerFl = null;
		if(careerInfoList.isEmpty()) careerFl = "신입";
		else careerFl = "경력";
		
		recruitmentResume.setCareerFl(careerFl);
		
		return recruitmentResume;
	}
	
	
	/* ********** 회원탈퇴 페이지 관련 ********** */
}

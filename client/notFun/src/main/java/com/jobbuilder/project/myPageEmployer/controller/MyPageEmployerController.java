package com.jobbuilder.project.myPageEmployer.controller;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.SessionAttribute;
import org.springframework.web.bind.annotation.SessionAttributes;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.jobbuilder.project.employer.model.dto.BusinessWorktype;
import com.jobbuilder.project.employer.model.dto.Employer;
import com.jobbuilder.project.myPageEmployer.model.service.MyPageEmployerService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Controller
@RequestMapping("myPageEmp")
@SessionAttributes({"loginEmployer"})
@RequiredArgsConstructor
@Slf4j
public class MyPageEmployerController {
	
	/* ********** 필드 ********** */
	private final MyPageEmployerService service;
	
	/* ********** 메서드 ********** */
	
	/** 내 정보 보기 페이지 이동(get)
	 * @return myPageEmployer/info.html
	 * @author JWJ
	 */
	@GetMapping("info")
	public String MyPageEmpInfo(@SessionAttribute("loginEmployer") Employer loginEmployer,
								Model model) {
		log.debug("loginEmployer : " + loginEmployer);
		
		/* 로직 순서
		 * 1. loginEmployer에서 정보 꺼내오기(memberNo, membershipName, memberTel, businessName)
		 * 2. memberNo 가 동일한 고용주의 EMPLOYER(사업장당 1개) list 얻어오기(최소1개,본점)
		 * 3. list 마다 데이터 얻기(businessNickname, businessTel, busnessAddress, 
		 * 		businessImgList, businessWorktypeList)
		 * */
		
		// 고용주 1명의 사업장 리스트 얻어오기
		List<Employer> businessList = service.selectBusinessList(loginEmployer.getMemberNo());
		for(Employer business : businessList) {
			
			String[] arr = business.getBusinessAddress().split("\\^\\^\\^");
			
			if(arr.length > 2) {				
				String businessAddress = arr[1] + ", " + arr[2];
				business.setBusinessAddress(businessAddress);
			}
		}
		model.addAttribute("businessList", businessList);
		
		return "myPageEmployer/info";
	}
	
	/** 사업장 정보 얻어오기(내 정보 보기 페이지 내 모달 창)
	 * @param employerNo
	 * @return
	 * @author JWJ
	 */
	@ResponseBody
	@GetMapping("business")
	public Employer getBuisness(@RequestParam("employerNo") String employerNo) {
		
		int empNo = Integer.parseInt(employerNo);
		Employer employer = service.getBusiness(empNo);
		
		String[] arr = employer.getBusinessAddress().split("\\^\\^\\^");
		if(arr.length > 2) {
			String businessAddress = arr[1] + ", " + arr[2];
			employer.setBusinessAddress(businessAddress);
		}
		
		return employer;
	}
	
	/** 기본정보 수정 페이지 이동(get) 아직 작성 안함
	 * @param loginEmployer
	 * @param model (주소 전달용)
	 * @return myPageEmployer/updateInfo.html
	 * @author JWJ
	 */
	@GetMapping("updateInfo")
	public String MyPageUpdateInfo(@SessionAttribute("loginEmployer") Employer loginEmployer,
								Model model) {
		return "myPageEmployer/updateInfo";
	}
	
	/** 비밀번호 변경 페이지 이동(get) 아직 작성 안함
	 * @return myPageEmployer/changePw.html
	 * @author JWJ
	 */
	@GetMapping("changePw")
	public String MyPageEmpChangePw() {
		return "myPageEmployer/changePw";
	}
	
	/** 내가 쓴 공고 페이지 이동(get) 작성 중
	 * @return myPageEmployer/recruitmentList.html
	 * @author JWJ
	 */
	@GetMapping("recruitmentList")
	public String MyPageEmpRecruitmentList() {
		return "myPageEmployer/recruitmentList";
	}
	
	
	/** 내가 쓴 글 페이지 이동(get) 아직 작성 안함
	 * @return myPageEmployer/myWrite.html
	 * @author JWJ
	 */
	@GetMapping("myWrite")
	public String MyPageEmpMyWrite() {
		return "myPageEmployer/myWrite";
	}
	
	/** 사업장 추가 페이지 이동(get)
	 * @return myPageEmployer/addBusiness.html
	 * @author JWJ
	 */
	@GetMapping("addBusiness")
	public String MyPageEmpAddBusiness(Model model) {
		List<Map<String,String>> majorCategoryList = service.selectMajorCategory();
		model.addAttribute("majorCategoryList", majorCategoryList);
		return "myPageEmployer/addBusiness";
	}
	
	/** workType 가 일치한 소분류 업직종 불러오기 (사업장 추가 페이지 내)
	 * @param workTypeNo
	 * @return
	 */
	@ResponseBody
	@GetMapping("selectSubWorkType/{workTypeNo}")
	public List<Map<String,String>> subCategoryList(@PathVariable("workTypeNo") String workTypeNo) {
		return service.selectsubCategoryList(workTypeNo);
	}
	
	/** 사업장 추가(post)
	 * @param loginEmployer(memberNo, businessRegistrationNumber, businessName, membershipLevel, optionalAgreeFl)
	 * @param addEmployer(businessNickname, businessTel)
	 * @param subCategory(업직종 리스트)
	 * @param businessAddress(사업장주소 변환용)
	 * @param images
	 * @return
	 * @author JWJ
	 */
	@PostMapping("addBusiness")
	public String MyPageEmpAddBusiness(@SessionAttribute("loginEmployer") Employer loginEmployer,
						Employer addBusiness,
						@RequestParam("subCategory") List<String> subCategory,
						@RequestParam("businessAddress") String[] businessAddress,
						RedirectAttributes ra) {
		
		log.debug("loginEmployer : " + loginEmployer);
		log.debug("addBusiness : " + addBusiness);
		log.debug("subCategory : " + subCategory);
		log.debug("businessAddress : " + businessAddress);
		
		String message = null;
		String path = null;
		
		int result = service.addBusiness(loginEmployer, addBusiness, subCategory, businessAddress);
		
		if(result == 0) {
			message = "사업장추가 실패";
			path = "addBusiness";
			
		} else {
			message = "사업장이 추가되었습니다";
			path = "info";
		}
		
		ra.addFlashAttribute("message", message);

		return "redirect:" + path;
	}
	
	/** 사업장 홍보 페이지 이동(get) 아직 작성 안함
	 * @return myPageEmployer/promoteBusiness.html
	 * @author JWJ
	 */
	@GetMapping("promoteBusiness")
	public String MyPageEmpPromoteBusiness() {
		return "myPageEmployer/promoteBusiness";
	}
	
	/** 제출된 이력서 보기 페이지 이동(get) 아직 작성 안함
	 * @return myPageEmployer/viewRecruitments.html
	 * @author JWJ
	 */
	@GetMapping("viewRecruitments")
	public String MyPageEmpViewRecruitments() {
		return "myPageEmployer/viewRecruitments";
	}
	
	/** 회원 탈퇴 페이지 이동(get) 아직 작성 안함
	 * @return myPageEmployer/secession.html
	 * @author JWJ
	 */
	@GetMapping("secession")
	public String MyPageEmpSecession() {
		return "myPageEmployer/secession";
	}

}

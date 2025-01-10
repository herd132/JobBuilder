package com.jobbuilder.project.myPageEmployer.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.SessionAttribute;
import org.springframework.web.bind.annotation.SessionAttributes;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.jobbuilder.project.board.model.dto.Board;
import com.jobbuilder.project.employer.model.dto.BusinessImg;
import com.jobbuilder.project.employer.model.dto.BusinessWorktype;
import com.jobbuilder.project.employer.model.dto.Employer;
import com.jobbuilder.project.myPageEmployer.model.dto.RecruitmentResume;
import com.jobbuilder.project.myPageEmployer.model.service.MyPageEmployerService;
import com.jobbuilder.project.recruitment.model.dto.Recruitment;
import com.jobbuilder.project.recruitment.model.dto.ResumeWJ;

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
		
		List<Recruitment> recruitmentList = service.getRecruitmentList(empNo);
		employer.setRecruitmentList(recruitmentList);
		
		return employer;
	}
	
	
	/** 기본정보 수정 페이지 이동(get)
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
	
	/** 기본정보 수정페이지 이동 내 비밀번호 확인
	 * @param bodyMap
	 * @return
	 */
	@ResponseBody
	@PostMapping("checkPw")
	public ResponseEntity<Employer> CheckPw(@RequestBody Map<String, String> bodyMap) {
		
		log.debug("bodyMap : " + bodyMap);
		Employer mainEmployer = service.checkPw(bodyMap);
		
		if(mainEmployer == null) return ResponseEntity.noContent().build();
		
		return ResponseEntity.ok(mainEmployer);
	}
	
	/** 비밀번호 변경 페이지 이동(get) 아직 작성 안함
	 * @return myPageEmployer/changePw.html
	 * @author JWJ
	 */
	@GetMapping("changePw")
	public String MyPageEmpChangePw() {
		return "myPageEmployer/changePw";
	}
	
	
	/** 내가 쓴 공고 페이지 이동(get)
	 * @param loginEmployer
	 * @param cp (현재 조회 요청한 페이지 번호)
	 * @param paramMap (검색할 경우)
	 * @param model
	 * @return
	 */
	@GetMapping("recruitmentList")
	public String MyPageEmpRecruitmentList(@SessionAttribute("loginEmployer") Employer loginEmployer,
								@RequestParam(value="cp", required=false, defaultValue="1") int cp,
								@RequestParam Map<String, Object> paramMap,
								Model model) {
		
		Map<String, Object> map = null;
		
		// 검색 안한 경우 : paramMap == {}
		// 검색 한 경우 : paramMap == {key=t, query=서울}
		if(paramMap.get("key") == null) {
			map = service.selectRecruitmentList(loginEmployer.getMemberNo(), cp);
			
		} else {
			paramMap.put("memberNo", loginEmployer.getMemberNo());
			map = service.searchRecruitmentList(paramMap, cp);
		}
		
		model.addAttribute("paginationRecruitment", map.get("paginationRecruitment"));
		model.addAttribute("recruitmentList", map.get("recruitmentList"));
		
		log.debug("paginationRecruitment : " + map.get("paginationRecruitment"));
		log.debug("recruitmentList : " + map.get("recruitmentList"));
		
		
		return "myPageEmployer/recruitmentList";
	}
	
	/** 구인완료여부 변경 (내가 쓴 공고 페이지 내)
	 * @param badyMap(recruitmentNo, complete)
	 * @return
	 */
	@ResponseBody
	@PutMapping("changeRecruitComplete")
	public int changeRecruitComplete(@RequestBody Map<String, Object> badyMap) {
		return service.changeRecruitComplete(badyMap);
	}
	
	
	/** 내가 쓴 글 페이지 이동(get) 아직 작성 안함
	 * @return myPageEmployer/myWrite.html
	 * @author JWJ
	 */
	@GetMapping("myWrite")
	public String MyPageEmpMyWrite() {
		return "myPageEmployer/myBoard";
	}
	
	/** 내가 쓴 글 목록 불러오기
	 * @param loginEmployer
	 * @param cp
	 * @return
	 */
	@ResponseBody
	@GetMapping("viewMyBoard")
	public List<Board> viewMyBoard(@SessionAttribute("loginEmployer") Employer loginEmployer,
						@RequestParam(value="cp",required = false, defaultValue = "1") int cp) {
		return service.viewMyBoard(loginEmployer.getMemberNo(), cp);
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
	
	/** 사업장 지점명 중복검사
	 * @param badyMap(businessNickname, memberNo)
	 * @return
	 */
	@ResponseBody
	@PostMapping("checkBusinessNickname")
	public int CheckBusinessNickname(@RequestBody Map<String, String> bodyMap) {
		log.debug("bodyMap : " + bodyMap);
		return service.checkBusinessNickname(bodyMap);
	}
	
	/** 사업장 전화번호 중복검사
	 * @param bodyMap(businessTel, memberNo)
	 * @return
	 */
	@ResponseBody
	@PostMapping("checkBusinessTel")
	public int CheckBusinessTel(@RequestBody Map<String, String> bodyMap) {
		return service.checkBusinessTel(bodyMap);
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
						@RequestParam("images") List<MultipartFile> images,
						RedirectAttributes ra) throws Exception {
		
		int result = service.addBusiness(loginEmployer, addBusiness, subCategory, businessAddress, images);

		String message = null;
		String path = null;
		
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
	
	
	/** 사업장 수정페이지 이동(get)
	 * @return
	 */
	@GetMapping("updateBusiness/{employerNo:[0-9]+}")
	public String updateBusiness(@SessionAttribute("loginEmployer") Employer loginEmployer,
							@PathVariable("employerNo") int employerNo,
							Model model, RedirectAttributes ra) {
		
		Employer business = service.getBusiness(employerNo);
		
		if(business.getMemberNo() != loginEmployer.getMemberNo()) {
			ra.addFlashAttribute("message", "자신의 사업장만 수정할 수 있습니다");
			return "redirect:/";
		}
		
		business.setBusinessImgList(service.getBusinessImgList(employerNo));
		
		List<Map<String,String>> majorCategoryList = service.selectMajorCategory();
		
		String businessAddress = business.getBusinessAddress();
		String[] arr = businessAddress.split("\\^\\^\\^");
		if(arr.length > 2) {
			model.addAttribute("postcode", arr[0]);
			model.addAttribute("address", arr[1]);
			model.addAttribute("detailAddress", arr[2]);
		}
		
		model.addAttribute("business", business);
		model.addAttribute("majorCategoryList", majorCategoryList);
		
		return "myPageEmployer/updateBusiness";
	}
	
	/** 사업장 수정(post)
	 * @param updateBusiness (employerNo, businessNickname, businessTel)
	 * @param employerNo (사업장 번호)
	 * @param subCategory (업직종 리스트)
	 * @param businessAddress (사업장주소 배열)
	 * @param images (사업장 이미지 배열)
	 * @param deleteOrderList (기존에 있었다가 이미지 삭제한 경우 처리위한 String)
	 * @return
	 */
	@PostMapping("updateBusiness/{employerNo:[0-9]+}")
	public String updateBusiness(Employer updateBusiness,
						@PathVariable("employerNo") int employerNo,
						@RequestParam(value="subCategory", required=false) List<String> subCategory,
						@RequestParam("businessAddress") String[] businessAddress,
						@RequestParam("images") List<MultipartFile> images,
						@RequestParam(value="deleteOrderList", required=false) String deleteOrderList,
						@RequestParam(value="cp", required=false, defaultValue="1") int cp,
						RedirectAttributes ra) throws Exception {
		
		log.debug("updateBusiness :" + updateBusiness);
		log.debug("subCategory :" + subCategory);
		log.debug("businessAddress :" + businessAddress);
		log.debug("images :" + images);
		
		updateBusiness.setEmployerNo(employerNo);
		
		int result = service.updateBusiness(updateBusiness, subCategory, businessAddress, images, deleteOrderList);
		
		String message = null;
		String path = null;
		
		if(result > 0) {
			message = "사업장 내용이 변경되었습니다";
			path = "/myPageEmp/info";
			
		} else {
			message = "사업장 수정 실패..";
			path = "/myPageEmp/updateBusiness/" + employerNo;
		}
		
		ra.addFlashAttribute("message", message);
		return "redirect:" + path;
	}
	
	
	/** 사업장 삭제
	 * @param loginEmployer (본점 정보)
	 * @param employerNo (지점 정보)
	 * @return
	 */
	@GetMapping("deleteBusiness/{employerNo:[0-9]+}")
	public String deleteBusiness(@SessionAttribute("loginEmployer") Employer loginEmployer,
							@PathVariable("employerNo") int employerNo,
							RedirectAttributes ra) {
		
		int memberNo = service.getMemberNo(employerNo);
		
		String message = null;
		
		if(memberNo != loginEmployer.getMemberNo()) {
			message = "본인의 사업장만 삭제할 수 있습니다";
			return "redirect:/myPageEmp/info";	
		}
		
		int result = service.deleteBusiness(employerNo);
		
		if (result > 0) message = "해당 사업장이 삭제되었습니다";
		else message = "사업장 삭제에 실패했습니다";
		
		ra.addFlashAttribute("message", message);
	
		return "redirect:/myPageEmp/info";
	}
	
	
	
	
//	/** 사업장 홍보 페이지 이동(get) 아직 작성 안함
//	 * @return myPageEmployer/promoteBusiness.html
//	 * @author JWJ
//	 */
//	@GetMapping("promoteBusiness")
//	public String MyPageEmpPromoteBusiness() {
//		return "myPageEmployer/promoteBusiness";
//	}
	
	/** 제출된 이력서 보기 페이지 이동(get) (렌더링은 이하 비동기)
	 * @return myPageEmployer/viewRecruitments.html
	 * @author JWJ
	 */
	@GetMapping("viewResumes")
	public String MyPageEmpViewResumes(@SessionAttribute("loginEmployer") Employer loginEmployer) {
		
		return "myPageEmployer/viewResumes";
	}
	
	/** 공고에 제출된 이력서 조회(폐기/ 무한스크롤 사용할 때 쓸수 없음)
	 * @param memberNo
	 * @return
	 */
	@ResponseBody
	@GetMapping("viewResumes/{memberNo:[0-9]+}")
	public Map<List<Integer>, RecruitmentResume> viewResumes(@PathVariable("memberNo") int memberNo){
		
		return service.viewResumes(memberNo);
	}
	
	/** 무한스크롤 테스트용 공고에 제출된 이력서 조회
	 * @param memberNo
	 * @return
	 */
	@ResponseBody
	@GetMapping("viewResumes3/{memberNo:[0-9]+}")
	public List<RecruitmentResume> viewResumesList(@PathVariable("memberNo") int memberNo,
						@RequestParam(value="cp",required = false, defaultValue = "1") int cp){
		
		return service.viewResumesList(memberNo, cp);
	}
	
	/** 해당 공고에 제출된 이력서 보기
	 * @param recuritmentNo
	 * @param resumeNo
	 * @return
	 */
	@ResponseBody
	@GetMapping("viewRecruitResume")
	public ResponseEntity<RecruitmentResume> viewRecruitResume(@RequestParam("recruitmentNo") int recruitmentNo,
									@RequestParam("resumeNo") int resumeNo){
		
		RecruitmentResume recruitResume = service.viewRecruitResume(recruitmentNo, resumeNo);
		
		if(recruitResume == null) return ResponseEntity.noContent().build();
		
		return ResponseEntity.ok(recruitResume);
	}
	
	/** 회원 탈퇴 페이지 이동(get) 아직 작성 안함
	 * @return myPageEmployer/secession.html
	 * @author JWJ
	 */
	@GetMapping("secession")
	public String MyPageEmpSecession() {
		return "myPageEmployer/secession";
	}
	
	//맨 밑에 만든 페이지 나중에 복붙
	/** 사업자 홍보 페이지 이동(get) 아직 작성 안함
	 * @return myPageEmployer/promoteBusiness.html
	 * @author JWJ
	 */
	@GetMapping("promoteBusiness")
	public String MyPageEmpPromoteBusiness(@SessionAttribute("loginEmployer") Employer loginEmployer, Model model) {
		
		
		// 고용주 1명의 사업장 리스트 얻어오기
			List<Employer> businessList = service.selectBusinessList(loginEmployer.getMemberNo());
			for(Employer business : businessList) {
			
			String[] arr = business.getBusinessAddress().split("\\^\\^\\^");
			
			if(arr.length > 2) {				
				String businessAddress = arr[1] + ", " + arr[2];
				business.setBusinessAddress(businessAddress);
			}
		}
		log.debug("login고용주" + loginEmployer);
		log.debug("고용주" + businessList);
		model.addAttribute("businessList" ,businessList);
		
		return "myPageEmployer/promoteBusiness";
	}

}

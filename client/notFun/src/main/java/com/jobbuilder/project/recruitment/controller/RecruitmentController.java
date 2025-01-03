package com.jobbuilder.project.recruitment.controller;

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

import com.jobbuilder.project.employer.model.dto.Employer;
import com.jobbuilder.project.recruitment.model.dto.Recruitment;
import com.jobbuilder.project.recruitment.model.serivce.RecruitmentService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Controller
@RequestMapping("recruitment")
@SessionAttributes({"loginEmployer"})
@RequiredArgsConstructor
@Slf4j
public class RecruitmentController {

	/* ********** 필드 ********** */
	private final RecruitmentService service;
	
	/* ********** 메서드 ********** */

	/** 공고 추가 페이지 이동(get)
	 * @param loginEmployer
	 * @param model
	 * @return
	 * @author JWJ
	 */
	@GetMapping("addRecruitment")
	private String addRecruitment(@SessionAttribute("loginEmployer") Employer loginEmployer,
							Model model) {
		
		List<Employer> businessList = service.selectBusinessList(loginEmployer.getMemberNo());
		List<Map<String, String>> preferredList = service.selectPreferredList();
		List<Map<String, String>> supportTitleList = service.selectSupportTitleList();
		
		model.addAttribute("businessList", businessList);
		model.addAttribute("preferredList", preferredList);
		model.addAttribute("supportTitleList", supportTitleList);

		return "recruitment/addRecruitment";
	}
	
	/** 복리후생 소분류 불러오기(사업장 추가 페이지 내)
	 * @param supportNo
	 * @return
	 * @author JWJ
	 */
	@ResponseBody
	@GetMapping("selectSubSupport/{supportNo}")
	private List<Map<String, String>> subSupportList(@PathVariable("supportNo") String supportNo){
		return service.selectSubSupportList(supportNo);
	}
	
	/** 공고 추가 (post)
	 * @param addRecruitment
	 * @param preferredList
	 * @param supportList
	 * @param images (아직 데이터 안넣었음)
	 * @param ra
	 * @return
	 * @author JWJ
	 */
	@PostMapping("addRecruitment")
	private String addRecruitment(Recruitment addRecruitment,
					@SessionAttribute("loginEmployer") Employer loginEmployer,
					@RequestParam(value="recruitmentPrefers", required=false) List<String> preferredList,
					@RequestParam(value="recruitmentSupports", required=false) List<String> supportList,
					@RequestParam(value="images", required=false) List<MultipartFile> images,
					RedirectAttributes ra) {
		
		log.debug("addRecruitment : " + addRecruitment);
		log.debug("recruitmentPrefers : " + preferredList);
		log.debug("recruitmentSupports : " + supportList);
		
		/* 파라미터 중 RECRUITMENT TABLE에 삽입시 필요한 것들 (RECRUITMENT_NO는 SEQ 이용) 
		 * addRecruitment : recruitmentTitle, recruitmentContent, recruitmentDeadline(2025-02-01 형태),
		 * 				jobtypeNo, numOfRecruitmentName, salaryNo, gradeNo, periodNo, daysNo, timeNo,
		 * 				employerNo, salaryMount
		 * 
		 * 이하 RECRUITMENT_NO 불러와서 M:N 테이블(RECRUITMENT_PREFERRED, RECRUITMENT_SUPPORT)에 저장
		 * preferredList : PREFERRED TABLE에서 PREFERRED_CATEGORY를 모아놓은 리스트
		 * supportList : SUPPORT TABLE 에서 SUPPORT_CATEGORY를 모아놓은 리스트
		 * */
		int recruitmentNo = service.insertRecruitment(loginEmployer.getMemberNo() ,addRecruitment, preferredList, supportList);
		
		String message = null;
		String path = null;
		
		if(recruitmentNo > 0) {
			message = "새 공고가 추가되었습니다";
			path = "/myPageEmp/recruitmentList";
			
		} else {
			message = "새 공고 추가 실패..";
			path = "addRecruitment";
		}
		
		ra.addFlashAttribute("message", message);
		
		return "redirect:" + path;
	}
	
	/** 공고글 목록 조회
	 * @param cp
	 * @param query(검색할 경우)
	 * @param model
	 * @return
	 */
	@GetMapping("list")
	public String recruitmentList(@RequestParam(value="cp", required=false, defaultValue="1") int cp,
							@RequestParam(value="query", required=false) String query,
							Model model) {
		
		Map<String, Object> map = null;
		
		if(query == null) map = service.selectRecruitmentList(cp);
		else map = service.selectSearchRecruitmentList(query, cp);
		
		model.addAttribute("paginationRecruitment", map.get("paginationRecruitment"));
		model.addAttribute("recruitmentList", map.get("recruitmentList"));
		
		log.debug("paginationRecruitment : " + map.get("paginationRecruitment"));
		log.debug("recruitmentList : " + map.get("recruitmentList"));
		
		return "recruitment/recruitmentList";
	}
	
	/** 공고 상세 페이지 이동(get)	/recruitment/detail/18?cp=1
	 * @param recruitmentNo
	 * @return
	 */
	@GetMapping("detail/{recruitmentNo:[0-9]+}")
	public String recruitmentDetail (@PathVariable("recruitmentNo") int recruitmentNo,
						@SessionAttribute(value="loginEmployer", required=false) Employer loginEmployer,
						Model model, RedirectAttributes ra) {
		
		Recruitment recruitment = service.selectOne(recruitmentNo);
		
		log.debug("recruitment : " + recruitment);

		model.addAttribute("recruitment", recruitment);
		model.addAttribute("businessWorktypeList", recruitment.getBusinessWorktypeList());
		model.addAttribute("preferredList", recruitment.getPreferredList());
		model.addAttribute("supportList", recruitment.getSupportList());;
		
		return "recruitment/recruitmentDetail";
	}
}

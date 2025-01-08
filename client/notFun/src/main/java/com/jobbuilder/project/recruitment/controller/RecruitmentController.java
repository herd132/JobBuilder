package com.jobbuilder.project.recruitment.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
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
import com.jobbuilder.project.recruitment.model.dto.ResumeWJ;
import com.jobbuilder.project.recruitment.model.serivce.RecruitmentService;
import com.jobbuilder.project.resume.model.dto.Resume;
import com.jobbuilder.project.resume.model.service.RecommendService;
import com.jobbuilder.project.worker.model.dto.Worker;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Controller
@RequestMapping("recruitment")
@SessionAttributes({"loginEmployer", "loginWorker"})
@RequiredArgsConstructor
@Slf4j
public class RecruitmentController {

	/* ********** 필드 ********** */
	private final RecruitmentService service;
	
	private final RecommendService recommendService;
	
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
		List<Map<String,String>> majorAddressList = service.selectAddressList();
		
		model.addAttribute("businessList", businessList);
		model.addAttribute("preferredList", preferredList);
		model.addAttribute("supportTitleList", supportTitleList);
		model.addAttribute("majorAddressList", majorAddressList);

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
	
	/** 주소 소분류 불러오기(사업장 추가페이지 내)
	 * @param workcondAddressTypeNo
	 * @return
	 */
	@ResponseBody
	@GetMapping("selectSubAddress/{workcondAddressTypeNo}")
	private List<Map<String, String>> subAddressList(@PathVariable("workcondAddressTypeNo") String workcondAddressTypeNo){
		return service.selectSubAddress(workcondAddressTypeNo);
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
					@RequestParam(value="recruitmentImg", required=false) MultipartFile recruitmentImg,
					RedirectAttributes ra) throws Exception {
		
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
		int recruitmentNo = service.insertRecruitment(loginEmployer.getMemberNo() ,addRecruitment,
								preferredList, supportList, recruitmentImg);
		
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
		int recommendNum = recommendService.getRecommendCount(recruitment);
		
		log.debug("recruitment : " + recruitment);

		model.addAttribute("recruitment", recruitment);
		model.addAttribute("businessWorktypeList", recruitment.getBusinessWorktypeList());
		model.addAttribute("preferredList", recruitment.getPreferredList());
		model.addAttribute("supportList", recruitment.getSupportList());
		model.addAttribute("recommendNum", recommendNum);
		
		return "recruitment/recruitmentDetail";
	}
	
	/** 로그인한 알바생의 이력서 목록 조회
	 * @param workerNo
	 * @return
	 */
	@ResponseBody
	@GetMapping("selectResume")
	public ResponseEntity<List<ResumeWJ>> selectResume(@RequestParam("workerNo") int workerNo){
		
		List<ResumeWJ> resumeList = service.selectResumeList(workerNo);
		
		if(resumeList == null) return ResponseEntity.noContent().build();
		
		return ResponseEntity.ok(resumeList);
	}
	
	/** 무결성 검사(PFK 조건 확인용)
	 * @param recruitmentNo
	 * @param resumeNo
	 * @return
	 */
	@ResponseBody
	@GetMapping("confirm/{recruitmentNo:[0-9]+}")
	public ResponseEntity<Integer> confirmResume(@PathVariable("recruitmentNo") int recruitmentNo,
						@RequestParam("resumeNo") int resumeNo){
		
		int confirmResume = service.selectRecruitmentResume(recruitmentNo, resumeNo);
		
		if(confirmResume > 0) return ResponseEntity.noContent().build();
		
		return ResponseEntity.ok(1);
	}
	
	/** PFK 테이블(RECURITMENT_RESUME)에 데이터 추가
	 * @param recruitmentNo
	 * @param loginWorker
	 * @param resumeNo
	 * @return
	 */
	@GetMapping("submit/{recruitmentNo:[0-9]+}")
	public String submitResume(@PathVariable("recruitmentNo") int recruitmentNo,
							@RequestParam("resumeNo") int resumeNo,
							RedirectAttributes ra) {
		
		int result = service.submitResume(recruitmentNo, resumeNo);
		
		String message = null;
		
		if(result > 0) message = "해당 공고에 지원을 완료했습니다.";
		else message = "공고에 지원 실패했습니다.";
		
		ra.addFlashAttribute("message", message);
		
		return "redirect:/recruitment/detail/" + recruitmentNo;
	}

	/** 공고 수정 페이지 이동(get)	
	 * @param recruitmentNo
	 * @param loginEmployer
	 * @return
	 */
	@GetMapping("update/{recruitmentNo:[0-9]+}")
	public String updateRecruitment(@PathVariable("recruitmentNo") int recruitmentNo,
						@SessionAttribute("loginEmployer") Employer loginEmployer,
						Model model, RedirectAttributes ra) {
		
		Recruitment recruitment = service.selectOne(recruitmentNo);
		
		String message = null;
		String path = null;
		
		if(recruitment == null) {
			message = "해당 공고가 존재하지 않습니다.";
			path = "redirect:/";
			ra.addFlashAttribute("message", message);
			
		} else if (recruitment.getMemberNo() != loginEmployer.getMemberNo()){
			message = "자신이 작성한 공고만 수정할 수 있습니다";
			path = "redirect:/recruitment/list";
			ra.addFlashAttribute("message", message);
			
		} else {
			path = "recruitment/updateRecruitment";
			
			String[] deadlineArr = recruitment.getRecruitmentDeadline().split("/");
			String deadline = deadlineArr[0] + "-" + deadlineArr[1] + "-" + deadlineArr[2];
			recruitment.setRecruitmentDeadline(deadline);
			
			model.addAttribute("recruitment", recruitment);
			model.addAttribute("selectedBusinessWorktypeList", recruitment.getBusinessWorktypeList());
			model.addAttribute("selectedPreferredList", recruitment.getPreferredList());
			model.addAttribute("selectedSupportList", recruitment.getSupportList());
			
			List<Map<String, String>> preferredList = service.selectPreferredList();
			List<Map<String, String>> supportTitleList = service.selectSupportTitleList();
			model.addAttribute("preferredList", preferredList);
			model.addAttribute("supportTitleList", supportTitleList);
		}
		
		return path;
	}
	
	/** 공고 수정 (post)
	 * @param updateRecruitment
	 * @param recruitmentNo
	 * @param cp
	 * @param preferredList
	 * @param supportList
	 * @param businessImage
	 * @throws Exception
	 */
	@PostMapping("update/{recruitmentNo:[0-9]+}")
	public String updateRecruitment(Recruitment updateRecruitment,
					@PathVariable("recruitmentNo") int recruitmentNo,
					@RequestParam(value="cp", required=false, defaultValue="1") int cp,
					@RequestParam(value="recruitmentPrefers", required=false) List<String> preferredList,
					@RequestParam(value="recruitmentSupports", required=false) List<String> supportList,
					@RequestParam(value="recruitmentImg", required=false) MultipartFile recruitmentImg,
					RedirectAttributes ra) throws Exception {
		
		updateRecruitment.setRecruitmentNo(recruitmentNo);
		
		int result = service.updateRecruitment(updateRecruitment, preferredList, supportList, recruitmentImg);
		
		String message = null;
		String path = null;
		
		if(result > 0) {
			message = "공고가 수정되었습니다";
			path = "/recruitment/detail/" + recruitmentNo;
			
		} else {
			message = "공고 수정 실패...";
			path = "/recruitment/update/" + recruitmentNo;
		}
		
		ra.addFlashAttribute("message", message);
		
		return "redirect:" + path;
	}
	
	/** 공고삭제(get)
	 * @param recruitmentNo
	 * @param cp
	 * @param stat (마이페이지에서 들어온 경우)
	 * @return
	 */
	@GetMapping("delete/{recruitmentNo:[0-9]+}")
	public String deleteRecruitment(@PathVariable("recruitmentNo") int recruitmentNo,
					@RequestParam(value="cp", required=false, defaultValue="1") int cp,
					@RequestParam(value="stat", required=false, defaultValue="") String stat,
					RedirectAttributes ra) {
		
		int result = service.deleteRecruitment(recruitmentNo);
		
		String path = null;
		String message = null;
		
		if(result > 0) {
			message = "해당 공고가 삭제되었습니다";
			
			if(stat.length() > 0) path = "/myPageEmp/recruitmentList?cp=" + cp + "&stat=" + stat;
			else path = "/recruitment/list?cp=" + cp;
			
		} else {
			
			message = "공고삭제를 실패하였습니다";
			path = "";
		}
		
		ra.addFlashAttribute("message", message);
		return "redirect:" + path;
	}
	
	
	
	
	
}

package com.jobbuilder.project.recruitment.model.serivce;

import java.io.File;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.RowBounds;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.jobbuilder.project.common.util.Utility;
import com.jobbuilder.project.employer.model.dto.BusinessWorktype;
import com.jobbuilder.project.employer.model.dto.Employer;
import com.jobbuilder.project.recruitment.model.dto.PaginationRecruitment;
import com.jobbuilder.project.recruitment.model.dto.Recruitment;
import com.jobbuilder.project.recruitment.model.dto.ResumeWJ;
import com.jobbuilder.project.recruitment.model.mapper.RecruitmentMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
@PropertySource("classpath:/config.properties")
@Slf4j
public class RecruitmentServiceImpl implements RecruitmentService {

	/* ********** 필드 ********** */
	private final RecruitmentMapper mapper;

	@Value("${my.recruitment.web-path}")
	private String recruitmentWebPath;

	@Value("${my.recruitment.folder-path}")
	private String recruitmentFolderPath;

	/* ********** 메서드 ********** */

	/* ***** 공고 추가 페이지 이동 관련 ***** */
	@Override // 사업장 정보 얻어오기
	public List<Employer> selectBusinessList(int memberNo) {
		return mapper.selectBusinessList(memberNo);
	}

	@Override // 선호조건 리스트 불러오기
	public List<Map<String, String>> selectPreferredList() {
		return mapper.selectPreferredList();
	}

	@Override // 복리후생 대분류 불러오기
	public List<Map<String, String>> selectSupportTitleList() {
		return mapper.selectSupportTitleList();
	}

	@Override // 주소 대분류 불러오기
	public List<Map<String, String>> selectAddressList() {
		return mapper.selectAddressList();
	}

	@Override // 복리후생 소분류 불러오기
	public List<Map<String, String>> selectSubSupportList(String supportNo) {
		// TODO Auto-generated method stub
		return mapper.selectSubSupportList(supportNo);
	}

	@Override // 주소 소분류 불러오기
	public List<Map<String, String>> selectSubAddress(String workcondAddressTypeNo) {
		return mapper.selectSubAddress(workcondAddressTypeNo.substring(0, 2));
	}

	/* ***** 공고 추가(post) 관련 ***** */
	@Override // 공고 추가
	public int insertRecruitment(int memberNo, Recruitment addRecruitment, List<String> preferredList,
			List<String> supportList, MultipartFile recruitmentImg) throws Exception {

		addRecruitment.setMemberNo(memberNo);

		int result = mapper.insertRecruitment(addRecruitment);
		if (result == 0)
			return 0;

		int recruitmentNo = addRecruitment.getRecruitmentNo();

		if (preferredList != null) {

			for (String preferredCategory : preferredList) {

				String preferredNo = mapper.selectPreferredNo(preferredCategory);

				Map<String, Object> recruitmentPreferredNoMap = new HashMap<>();
				recruitmentPreferredNoMap.put("recruitmentNo", recruitmentNo);
				recruitmentPreferredNoMap.put("preferredNo", preferredNo);

				result = mapper.insertRecruitmentPreferred(recruitmentPreferredNoMap);
			}
		}

		if (supportList != null) {

			for (String supportCategory : supportList) {

				String supportNo = mapper.selectSupportNo(supportCategory);

				Map<String, Object> recruitmentSupportNoMap = new HashMap<>();
				recruitmentSupportNoMap.put("recruitmentNo", recruitmentNo);
				recruitmentSupportNoMap.put("supportNo", supportNo);

				result = mapper.insertRecruitmentSupport(recruitmentSupportNoMap);
			}
		}

		String rename = null;
		String recruitmentProfile = null;

		if (!recruitmentImg.isEmpty()) {

			rename = Utility.fileRename(recruitmentImg.getOriginalFilename());
			recruitmentProfile = recruitmentWebPath + rename;

			Map<String, Object> map = new HashMap<>();
			map.put("recruitmentNo", recruitmentNo);
			map.put("recruitmentProfile", recruitmentProfile);

			result = mapper.updateRecruitmentImg(map);
		}

		if (result > 0) {
			if (!recruitmentImg.isEmpty()) {
				recruitmentImg.transferTo(new File(recruitmentFolderPath + rename));
			}
		}

		return recruitmentNo;
	}

	/* ***** 공고글 목록 조회 관련 ***** */
	@Override // 공고글 목록 전체 조회
	public Map<String, Object> selectRecruitmentList(int cp) {

		int listCount = mapper.getListCount();
		PaginationRecruitment paginationRecruitment = new PaginationRecruitment(cp, listCount);

		int limit = paginationRecruitment.getLimit();
		int offset = (cp - 1) * limit;

		RowBounds rowBounds = new RowBounds(offset, limit);

		List<Recruitment> recruitmentList = mapper.selectRecruitmentList(rowBounds);
		/*
		 * 공고 목록에서 띄울 사항 recruitmentNo, recruitmentTitle, businessName(join),
		 * businessAddress(join) 가운데(앞쪽에서 2개만 ex 서울 관악구), salaryName(join), salaryMount,
		 * timeName(join) writeDate, recruitmentDeadline
		 * 
		 */

		for (Recruitment recruitment : recruitmentList) {
			String[] addressArr = recruitment.getBusinessAddress().split("\\^\\^\\^");
			String address = null;

			if (addressArr.length >= 2)
				address = addressArr[1];
			else
				address = addressArr[0];

			addressArr = address.split(" ");
			address = addressArr[0] + " " + addressArr[1];

			recruitment.setBusinessAddress(address);

		}

		Map<String, Object> map = new HashMap<>();
		map.put("paginationRecruitment", paginationRecruitment);
		map.put("recruitmentList", recruitmentList);

		return map;
	}

	@Override // 공고글 목록 검색결과 조회
	public Map<String, Object> selectSearchRecruitmentList(String query, String type, int cp) {

		int listCount = 0;

		if (type.equals("deadline")) { // 마감공고조회라면
			listCount = mapper.getDeadLineJobsCount(query);
			
		} else if(type.equals("region")){ // 지역별공고조회라면
			listCount = mapper.getRegionJobsCount(query);
			
		} else { // 그외 일반검색
			listCount = mapper.getSearchCount(query);
		}

		PaginationRecruitment paginationRecruitment = new PaginationRecruitment(cp, listCount);

		int limit = paginationRecruitment.getLimit();
		int offset = (cp - 1) * limit;

		RowBounds rowBounds = new RowBounds(offset, limit);

		List<Recruitment> recruitmentList = null;

		if (type.equals("deadline")) { // 마감공고조회라면
			recruitmentList = mapper.selectDeadlineJobList(query, rowBounds);
			
		} else if(type.equals("region")){ // 지역별공고조회라면
			recruitmentList = mapper.selectRegionJobList(query, rowBounds);
			
		} else { // 그외 일반검색
			recruitmentList = mapper.selectSearchRecruitmentList(query, rowBounds);
		}
		
		for (Recruitment recruitment : recruitmentList) {
			String[] addressArr = recruitment.getBusinessAddress().split("\\^\\^\\^");
			String address = null;

			if (addressArr.length >= 2)
				address = addressArr[1];
			else
				address = addressArr[0];

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

	@Override // 공고글 상세 조회
	public Recruitment selectOne(int recruitmentNo) {

		Recruitment recruitment = mapper.selectOne(recruitmentNo);
		log.debug("recruitment : " + recruitment);

		recruitment.setBusinessWorktypeList(mapper.getBWList(recruitment.getEmployerNo()));
		recruitment.setPreferredList(mapper.getPreferredList(recruitmentNo));
		recruitment.setSupportList(mapper.getSupportList(recruitmentNo));

		return recruitment;
	}

	@Override // 로그인한 알바생의 이력서 목록 조회
	public List<ResumeWJ> selectResumeList(int workerNo) {

		List<ResumeWJ> resumeList = mapper.selectResumeList(workerNo);
		if (resumeList.isEmpty())
			return null;
		// 각 ResumeWJ 에 resumeNo, resumeTitle, salaryNo, salaryName, salaryAmount,
		// gradeNo, gradeName 이 세팅되어 있음
		// 추가로 jobtype, period, days, time, 경력사항 추가해야함

		for (ResumeWJ resume : resumeList) {
			int resumeNo = resume.getResumeNo();

			resume.setResumeWorkTypeList(mapper.getWorkTypeList(resumeNo)); // 바리스타, 노래방 등
			resume.setResumeJobTypeList(mapper.getJobTypeList(resumeNo)); // 알바, 정규직
			resume.setResumePeriodList(mapper.getPeriodList(resumeNo)); // 1개월~3개월 등
			resume.setResumeDaysTimeList(mapper.getDaysTimeList(resumeNo)); // 요일시간 세트
			resume.setResumeCareerInfoList(mapper.getCareerInfoList(resumeNo)); // 경력사항

			log.debug("resume : " + resume);
		}

		return resumeList;
	}

	@Override // 한 공고에 동일한 이력서를 제출했는 지 조회
	public int selectRecruitmentResume(int recruitmentNo, int resumeNo) {

		Map<String, Integer> map = new HashMap<>();

		map.put("recruitmentNo", recruitmentNo);
		map.put("resumeNo", resumeNo);

		return mapper.selectRecruitmentResume(map);
	}

	@Override // 특정 공고에 이력서 제출
	public int submitResume(int recruitmentNo, int resumeNo) {

		Map<String, Integer> map = new HashMap<>();

		map.put("recruitmentNo", recruitmentNo);
		map.put("resumeNo", resumeNo);

		return mapper.submitResume(map);
	}

	/* ********** 공고 수정(post) 관련 ********** */

	@Override // 공고 수정
	public int updateRecruitment(Recruitment updateRecruitment, List<String> preferredList, List<String> supportList,
			MultipartFile recruitmentImg) throws Exception {

		log.debug("updateRecruitment : " + updateRecruitment);
		log.debug("preferredList : " + preferredList);
		log.debug("supportList : " + supportList);

		int result = mapper.updateRecruitment(updateRecruitment);

		if (result == 0)
			return 0;

		// 기존 M:N 해소 테이블에 있는 정보 삭제
		result = mapper.deleteRecruitmentPreferred(updateRecruitment.getRecruitmentNo());
		result = mapper.deleteRecruitmentSupport(updateRecruitment.getRecruitmentNo());

		// 이하 insertRecruitment 내 M:N 해소테이블 관련 코드와 동일
		if (preferredList != null) {

			for (String preferredCategory : preferredList) {

				String preferredNo = mapper.selectPreferredNo(preferredCategory);

				Map<String, Object> recruitmentPreferredNoMap = new HashMap<>();
				recruitmentPreferredNoMap.put("recruitmentNo", updateRecruitment.getRecruitmentNo());
				recruitmentPreferredNoMap.put("preferredNo", preferredNo);

				result = mapper.insertRecruitmentPreferred(recruitmentPreferredNoMap);

				if (result == 0) {
					log.debug("선호조건 삽입 중 문제발생");
					return 0;
				}
			}
		}

		if (supportList != null) {

			for (String supportCategory : supportList) {

				String supportNo = mapper.selectSupportNo(supportCategory);

				Map<String, Object> recruitmentSupportNoMap = new HashMap<>();
				recruitmentSupportNoMap.put("recruitmentNo", updateRecruitment.getRecruitmentNo());
				recruitmentSupportNoMap.put("supportNo", supportNo);

				result = mapper.insertRecruitmentSupport(recruitmentSupportNoMap);

				if (result == 0) {
					log.debug("복리후생 조건 삽입 중 문제발생");
					return 0;
				}
			}
		}

		String rename = null;
		String recruitmentProfile = null;

		if (!recruitmentImg.isEmpty()) {

			rename = Utility.fileRename(recruitmentImg.getOriginalFilename());
			recruitmentProfile = recruitmentWebPath + rename;

			Map<String, Object> map = new HashMap<>();
			map.put("recruitmentNo", updateRecruitment.getRecruitmentNo());
			map.put("recruitmentProfile", recruitmentProfile);

			result = mapper.updateRecruitmentImg(map);
		}

		if (result > 0) {
			if (!recruitmentImg.isEmpty()) {
				recruitmentImg.transferTo(new File(recruitmentFolderPath + rename));
			}
		}

		return updateRecruitment.getRecruitmentNo();
	}

	/* ********** 공고 삭제 관련 ********** */
	@Override // 공고 삭제
	public int deleteRecruitment(int recruitmentNo) {
		return mapper.deleteRecruitment(recruitmentNo);
	}

	/**
	 * 탑브랜드 최신공고번호 조회
	 */
	@Override
	public int getLatestTopBrandRecruitments(int employerNo) {
		return mapper.getLatestTopBrandRecruitments(employerNo);
	}

	/**
	 * 공고에 맞는 employNo 조회하기
	 *
	 */
	@Override
	public Recruitment showPromoteEmploy(String recruitmentNo, String businessNickname) {

		Map<String, Object> paramMap = new HashMap<>();
		paramMap.put("recruitmentNo", recruitmentNo);
		paramMap.put("businessNickname", businessNickname);

		return mapper.showPromoteEmploy(paramMap);
	}

	@Override
	public Employer getBusiness(int empNo) {
		
		Employer business = mapper.getBusiness(empNo);
		List<BusinessWorktype> businessWorktypeList = mapper.getBusinessWorktype(empNo);
		String thumbnail = mapper.selectThumbNail(business.getEmployerNo());

		String businessWorktype = "";
		for (int i = 0; i < businessWorktypeList.size(); i++) {
			if (i != 0)
				businessWorktype += ", ";
			businessWorktype += businessWorktypeList.get(i).getWorktypeCategory();
		}

		business.setThumbnail(thumbnail);
		business.setBusinessWorktype(businessWorktype);
		return business;
	}

	// 마감임박(해당날짜) 공고 조회
	@Override
	public Map<String, Object> selectDeadlineJobs(int cp, String day) {

		return null;
	}
}

package com.jobbuilder.project.recruitment.model.serivce;

import java.util.List;
import java.util.Map;

import com.jobbuilder.project.employer.model.dto.Employer;

public interface RecruitmentService {

	/** 사업장 정보 얻어오기
	 * @param memberNo
	 * @return
	 * @author JWJ
	 */
	List<Employer> selectBusinessList(int memberNo);

	/** 선호조건 리스트 불러오기
	 * @return
	 * @author JWJ
	 */
	List<Map<String, String>> selectPreferredList();

	/** 복리후생 대분류 불러오기
	 * @return
	 * @author JWJ
	 */
	List<Map<String, String>> selectSupportTitleList();

	/** 복리후생 소분류 불러오기
	 * @param supportNo
	 * @return
	 * @author JWJ
	 */
	List<Map<String, String>> selectSubSupportList(String supportNo);

}

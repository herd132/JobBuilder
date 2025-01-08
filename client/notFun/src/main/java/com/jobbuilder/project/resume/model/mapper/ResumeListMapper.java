package com.jobbuilder.project.resume.model.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import com.jobbuilder.project.recruitment.model.dto.Recruitment;
import com.jobbuilder.project.resume.model.dto.CareerInfo;
import com.jobbuilder.project.resume.model.dto.Resume;
import com.jobbuilder.project.resume.model.dto.ResumeDaysTime;
import com.jobbuilder.project.resume.model.dto.ResumeWorkType;

@Mapper
public interface ResumeListMapper {

	// 이력서 리스트 내 정보 가져오는 패치요청
	List<Resume> getResumeList(int workerNo);

	// 이력서리스트 삭제/수정 버튼 패치요청
	int updateResumeHideStatus(Resume resume);								// 숨김 요청
	int updateResumeDeleteStatus(Resume resume);							// 삭제 요청

	// 이력서디테일 페이지로 이동 내 이력서 조회
	Resume getResumeByNo(int resumeNo);

	// 맞춤공고 목록페이지 이동
	List<Recruitment> getRecommendations(int resumeNo);

	// 이력서 상세 페이지 내 정보 가져오는 패치요청 내 포함
	List<CareerInfo> careerInfo(int resumeNo);								// 경력     배열
	List<ResumeWorkType> resumeWorkType(int resumeNo);						// 근무직종 배열
	List<String> resumeJobTypeList(int resumeNo);							// 근무형태 배열
	List<ResumeDaysTime> resumeDaysTime(int resumeNo);						// 근무일시 배열

	
	// 업데이트 자기소개 예제
	int updateResumeContent(Map<String, Object> requestBody);

	
}

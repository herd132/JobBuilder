package com.jobbuilder.project.resume.model.service;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.jobbuilder.project.recruitment.model.dto.Recruitment;
import com.jobbuilder.project.resume.model.dto.CareerInfo;
import com.jobbuilder.project.resume.model.dto.Resume;
import com.jobbuilder.project.resume.model.dto.ResumeDaysTime;
import com.jobbuilder.project.resume.model.dto.ResumeWorkType;
import com.jobbuilder.project.resume.model.mapper.ResumeListMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
@Slf4j
public class ResumeListServiceImpl implements ResumeListService {

	private final ResumeListMapper mapper;

	// 이력서 리스트 내 정보 가져오는 패치요청
	@Override
	public List<Resume> getResumeList(int workerNo) {
        log.debug("Fetching membership details for workerNo: {}", workerNo);
        return mapper.getResumeList(workerNo);
	}

	// 이력서리스트 삭제/수정 버튼 패치요청
    @Override
    public int updateResumeStatus(Resume resume) {
        if (resume.getUpdateType() == 1) {
            return mapper.updateResumeHideStatus(resume);	// 비공개요청
        } else if (resume.getUpdateType() == 2) {
            return mapper.updateResumeDeleteStatus(resume);	// 삭제요청
        } else {
            throw new IllegalArgumentException("Invalid updateType: " + resume.getUpdateType());
        }
    }
    
    // 이력서디테일 페이지로 이동 내 이력서 조회
    @Override
    public Resume getResumeByNo(int resumeNo) {
    	return mapper.getResumeByNo(resumeNo);
    }

    // 맞춤공고 목록페이지 이동
    @Override
    public List<Recruitment> getRecommendations(int resumeNo) {
        return mapper.getRecommendations(resumeNo);
    }
    
    // 이력서 상세 페이지 내 정보 가져오는 패치요청 내 포함
    @Override
    public List<CareerInfo> careerInfo(int resumeNo) {					// 경력     배열
    	return mapper.careerInfo(resumeNo);
    }
    @Override
    public List<ResumeWorkType> resumeWorkType(int resumeNo) {			// 근무직종 배열
    	return mapper.resumeWorkType(resumeNo);
    }
    @Override
    public List<String> resumeJobTypeList(int resumeNo) {				// 근무형태 배열
    	return mapper.resumeJobTypeList(resumeNo);
    }
    @Override
    public List<ResumeDaysTime> resumeDaysTime(int resumeNo) {			// 근무일시 배열
       	return mapper.resumeDaysTime(resumeNo);
    }
    @Override
    public List<String> workcondAddressTypeInfo(int resumeNo) {			// 희망지역 배열
       	return mapper.workcondAddressTypeInfo(resumeNo);
    }
    
    // 근로자 유효성 검사
    @Override
    public Map<String, Object> getResumecheck(int resumeNo, int workerNo) {
        Map<String, Object> params = Map.of("resumeNo", resumeNo, "workerNo", workerNo);
        return mapper.getResumecheck(params); 
    }

    // 고용주 유효성 검사
	@Override
	public Map<String, Object> getEmployercheck(int resumeNo, int employerNo) {
	     Map<String, Object> params = Map.of("resumeNo", resumeNo, "employerNo", employerNo);
	     return mapper.getEmployercheck(params); 
	}



    
    
    // 자기소개 수정 예제
	@Override
	public int updateResumeContent(Map<String, Object> requestBody) {
	    return mapper.updateResumeContent(requestBody);
	}
    
    
}

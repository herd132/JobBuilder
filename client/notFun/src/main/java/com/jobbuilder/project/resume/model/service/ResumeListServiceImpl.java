package com.jobbuilder.project.resume.model.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.jobbuilder.project.recruitment.model.dto.Recruitment;
import com.jobbuilder.project.resume.model.dto.Resume;
import com.jobbuilder.project.resume.model.mapper.ResumeListMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
@Slf4j
public class ResumeListServiceImpl implements ResumeListService {

	private final ResumeListMapper mapper;


	@Override
	public List<Resume> getResumeList(int workerNo) {
        log.debug("Fetching membership details for workerNo: {}", workerNo);
        return mapper.getResumeList(workerNo);
	}


    @Override
    public int updateResumeStatus(Resume resume) {
        if (resume.getUpdateType() == 1) {
            return mapper.updateResumeHideStatus(resume);
        } else if (resume.getUpdateType() == 2) {
            return mapper.updateResumeDeleteStatus(resume);
        } else {
            throw new IllegalArgumentException("Invalid updateType: " + resume.getUpdateType());
        }
    }
    
    
    @Override
    public Resume getResumeByNo(int resumeNo) {
    	return mapper.selectResumeByNo(resumeNo);
    }

    
    @Override
    public List<Recruitment> getRecommendations(int resumeNo) {
        return mapper.selectRecommendationsByResumeNo(resumeNo);
    }
    
}

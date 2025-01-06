package com.jobbuilder.project.resume.model.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.jobbuilder.project.resume.model.dto.Resume;

@Mapper
public interface ResumeListMapper {

	List<Resume> getResumeList(int workerNo);


}

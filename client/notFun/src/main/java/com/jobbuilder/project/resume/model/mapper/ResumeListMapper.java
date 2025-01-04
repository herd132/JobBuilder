package com.jobbuilder.project.resume.model.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.springframework.data.repository.query.Param;

import com.jobbuilder.project.resume.model.dto.Resume;

@Mapper
public interface ResumeListMapper {

	List<Resume> getResumeList(int workerNo);

    int updateResumeStatus(
            @Param("resumeNo") int resumeNo,
            @Param("field") String field,
            @Param("value") String value,
            @Param("workerNo") int workerNo
        );

}

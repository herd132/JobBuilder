package com.jobbuilder.project.counsel.model.mapper;

import org.apache.ibatis.annotations.Mapper;

import com.jobbuilder.project.counsel.model.dto.Counselor;

@Mapper
public interface CounselMapper {

	Counselor get(int memberNo);

}

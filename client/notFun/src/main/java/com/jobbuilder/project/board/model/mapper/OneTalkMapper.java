package com.jobbuilder.project.board.model.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.jobbuilder.project.board.model.dto.OneTalk;

@Mapper
public interface OneTalkMapper {

	List<OneTalk> select();

	int insert(OneTalk oneTalk);

	int delete(int oneTalkNoBoard);

	int update(OneTalk oneTalk);

}

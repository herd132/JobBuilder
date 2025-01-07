package com.jobbuilder.project.board.model.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.session.RowBounds;

import com.jobbuilder.project.board.model.dto.OneTalk;

@Mapper
public interface OneTalkMapper {

	int getListCount();

	List<OneTalk> selectOneTalkList(RowBounds rowBounds);

	


}

package com.jobbuilder.project.board.model.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.session.RowBounds;

import com.jobbuilder.project.board.model.dto.OneTalk;

@Mapper
public interface OneTalkMapper {
	
	int getListCount(); // 글 수 조회

	List<OneTalk> selectOneTalkList(RowBounds rowBounds);

	// 비동기 조회, 삽입, 수정, 삭제
	List<OneTalk> select();
	int insert(OneTalk oneTalk);
	int update(OneTalk oneTalk);
	int delete(int oneTalkNo);

	


}

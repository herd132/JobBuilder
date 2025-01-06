package com.jobbuilder.project.board.model.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import com.jobbuilder.project.board.model.dto.Board;
import com.jobbuilder.project.board.model.dto.BoardImg;

@Mapper
public interface EditBoardMapper {
	
	
	int boardInsertEmp(Board inputBoard);			// 사업주 게시글 삽입
	int boardInsert(Board inputBoard);				// 게시글 삽입
	// 게시글 이미지 업로드
	int insertUploadList(List<BoardImg> uploadList);
	// 게시글 수정
	int boardUpdate(Board inputBoard);
	// 게시글 이미지 삭제
	int deleteImage(Map<String, Object> map);
	// 게시글 이미지 수정
	int updateImage(BoardImg img);
	// 게시글 이미지 추가
	int insertImage(BoardImg img);
	// 게시글 삭제
	int boardDelete(Map<String, Integer> map);
}

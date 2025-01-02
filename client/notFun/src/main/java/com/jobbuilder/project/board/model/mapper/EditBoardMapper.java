package com.jobbuilder.project.board.model.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.jobbuilder.project.board.model.dto.Board;
import com.jobbuilder.project.board.model.dto.BoardImg;

@Mapper
public interface EditBoardMapper {

	// 근로자 게시글 다루는 부분	
	int boardInsertWorker(Board inputBoard);				// 게시글 삽입
	int insertUploadListWorker(List<BoardImg> uploadList);	// 이미지 업로드


	
	// 고용주 게시글 다루는 부분
}

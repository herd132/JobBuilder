package com.jobbuilder.project.board.model.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.jobbuilder.project.board.model.dto.Board;

public interface EditBoardService {
	// 근로자 게시물 작성 / 수정 / 삭제 등
	int boardInsert(Board inputBoard, List<MultipartFile> images) throws Exception;

	
	
	
	
	
	// 고용주 게시물 작성 / 수정 / 삭제 등




	// 게시물 수정
	int boardUpdate(Board inputBoard, List<MultipartFile> images, String deleteOrderList);

}

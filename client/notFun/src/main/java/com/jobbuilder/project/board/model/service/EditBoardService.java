package com.jobbuilder.project.board.model.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.jobbuilder.project.board.model.dto.Board;

public interface EditBoardService {
	// 근로자 게시물 작성시
	int boardInsertWorker(Board inputBoard, List<MultipartFile> images) throws Exception;

}

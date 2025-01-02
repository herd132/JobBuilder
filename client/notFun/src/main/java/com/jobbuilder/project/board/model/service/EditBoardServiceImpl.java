package com.jobbuilder.project.board.model.service;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.jobbuilder.project.board.model.dto.Board;
import com.jobbuilder.project.board.model.dto.BoardImg;
import com.jobbuilder.project.board.model.mapper.EditBoardMapper;
import com.jobbuilder.project.common.util.Utility;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
@PropertySource("classpath:/config.properties")
@Slf4j
public class EditBoardServiceImpl implements EditBoardService{

	private final EditBoardMapper mapper;
	
	@Value("${my.board.web-path}")
	private String webPath; // /images/board/
	
	@Value("${my.board.folder-path}") // my.board.folder-path
	private String folderPath;	
	
	/**
	 * 게시글작성 - ( 근로자 )
	 */ 
	@Override
	@Transactional
	public int boardInsertWorker(Board inputBoard, List<MultipartFile> images) throws Exception {
		int result = mapper.boardInsertWorker(inputBoard);
		
		// result == INSERT 결과 ( 삽입 성공한 행의 개수 0 or 1 ) ..
		
		// 삽입 실패 시
		if(result == 0) {return 0;}
		
		// 삽입 성공 시	
		int boardNo = inputBoard.getBoardNo();		
	
		// 실제 업로드된 이미지의 정보를 모아둘 List 생성		
		List<BoardImg> uploadList = new ArrayList<>();
		
		// images 리스트에서 하나씩 꺼내어 파일이 있는지 검사..
		for(int i = 0; i < images.size() ; i++) {
			
			// 실제 선택된 파일이 존재하는 경우
			if(!images.get(i).isEmpty()) {
				
				// 원본명
				String originalName = images.get(i).getOriginalFilename();
				
				// 변경명
				String rename = Utility.fileRename(originalName);
				
				// 모든 값을 저장할 DTO 생성 (BoardImg - Builder 패턴 사용 ) 
				BoardImg img = BoardImg.builder()
							   .imgOriginalName(originalName)
							   .imgRename(rename)
							   .imgPath(webPath)
							   .boardNo(boardNo)
							   .imgOrder(i)
							   .uploadFile(images.get(i))
							   .build();		
				
				uploadList.add(img);			
			}
			
		}		
		// 선택한 파일이 전부 없을 경우 ..
		if(uploadList.isEmpty()) {
			return boardNo; // 컨트롤러로 게시글 번호만 넘김			
		}
		
		result = mapper.insertUploadListWorker(uploadList);
		
		// 다중 INSERT 성공 확인 
		if(result == uploadList.size()) {
			
			// 서버에 파일 저장
			for(BoardImg img : uploadList ) {
				img.getUploadFile().transferTo(new File(folderPath + img.getImgRename()));
			}
			
		} else {
			// 부분적으로 삽입 실패
			
			throw new RuntimeException();
		}
				
		return boardNo;
	}
}

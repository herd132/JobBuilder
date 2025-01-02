package com.jobbuilder.project.board.controller;

import java.util.List;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.SessionAttribute;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.jobbuilder.project.board.model.dto.Board;
import com.jobbuilder.project.board.model.service.BoardService;
import com.jobbuilder.project.board.model.service.EditBoardService;
import com.jobbuilder.project.employer.model.dto.Employer;
import com.jobbuilder.project.worker.model.dto.Worker;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Controller
@RequestMapping("editBoard")
@RequiredArgsConstructor
@Slf4j
public class EditBoardController {

	private final EditBoardService service;
	
	private final BoardService boardService;
	
	/** 게시글 작성 화면 전환
	 * @return
	 */
	@GetMapping("{boardCode:[0-9]+}/insert")
	public String boardInsert(@PathVariable("boardCode") int boardCode /* request scope에 한번 더 실림 */) {
		
		log.debug("여기로 들어오나요?");
		return "board/boardWrite"; // templates/boardWrite.html로 forward
	}
	
	
	/** 게시글작성
	 * @param boardCode : 어떤 게시판에 작성할 글인지 구분 ( 1 / 2 / 3... )
	 * @param inputBoard : 입력된 값(제목, 내용) 세팅되어있음 (커맨드 객체)
	 * @param loginMember  :  로그인한 회원 번호를 얻어오는 용도 ( 세션에 등록되어있음 ) 
	 * @param images : 제출된 file타입 input태그가 전달한 데이터들( 이미지파일) 
	 * @param ra : 리다이렉트시 request scope로 데이터 전달
	 * @return
	 */
	@PostMapping("{boardCode:[0-9]+}/insert")
	public String boardInsert(@PathVariable("boardCode") int boardCode,
							  @ModelAttribute Board inputBoard,
							  @SessionAttribute("loginWorker") Worker loginWorker,
							  @SessionAttribute("loginEmployer") Employer loginEmployer,
							  @RequestParam("images") List<MultipartFile> images,
							  RedirectAttributes ra) throws Exception {
		
		// 1. 로그인워커에 정보가 들어있을 경우
		if(loginWorker != null) {
			// 1. boardCode , 로그인한 회원의 번호를 inputBoard에 세팅
			inputBoard.setBoardCode(boardCode);
			inputBoard.setMemberNo(loginWorker.getMemberNo());
			// -> inputBoard 총 4가지 세팅됨 ( boardTitle, boardContent, boardCode, memberNo )
			
			// 2. 서비스 메서드 호출 후 결과 반환 받기	
			// -> 성공 시 [상세 조회]를 요청 할 수 있또록
			// 삽입된 게시글 번호를 반환받기
			int boardNo = service.boardInsertWorker(inputBoard, images);
			
			// 3. 서비스 결과에 따라 message, 리다이렉트 경로 지정
			
			String path = null;
			String message = null;			
			if(boardNo > 0 ) {
				path = "/board/" + boardCode + "/" + boardNo; // /board/1/2002 -> 상세 조회
				message = "게시글이 작성되었습니다!";		
			} else {
				path = "insert";
				message = "게시글 작성 실패...";
			}
			ra.addFlashAttribute("message", message);			
			return"redirect:"+path;
		}
		
		return null;
	}
	
}

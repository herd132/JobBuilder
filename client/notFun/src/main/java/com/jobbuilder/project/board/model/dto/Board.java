package com.jobbuilder.project.board.model.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class Board {
	private int boardNo;
	private String boardTitle;
	private String boardContent;
	private String boardWriteDate;
	private String boardUpdateDate;
	private int boardReadCount;
	private String boardDelFl;
	private int memberNo;
	private int boardCode;
	
	// 닉네임 
	private String workerNickname;
	private String businessName;
	
	// MEMBER 테이블 조인
	private String memberName;
	
	// 목록 조회 시 상관쿼리 결과
	private int commentCount;
	private int likeCount;

	// 게시글 작성자 프로필 이미지
	private String profileImg;
	
	// 게시글 목록 썸네일 이미지
	private String thumbnail;
	
	// -- 추가예정 -- 
	// 특정 게시글 이미지 목록
	private List<BoardImg> imageList;
	
	// 특정 게시글에 작성된 댓글 목록
	private List<CommentBoard> commentList;
	
	// 톡톡 게시판에 작성한 글 목록
	private List<OneTalk> oneTalkList;
	
}

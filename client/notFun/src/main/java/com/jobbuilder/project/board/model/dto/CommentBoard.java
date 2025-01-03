package com.jobbuilder.project.board.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@Builder
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class CommentBoard {
	

		private int commentNoBoard;
		private String commentContentBoard;
		private String commentWriteDateBoard;
		private String commentDelFlBoard;
		private int boardNo;
		private int memberNo;
		private int parentCommentNo;
		
		// 댓글 조회시 회원 프로필, 닉네임
		private String memberName;
		private String profileImg;
	
}

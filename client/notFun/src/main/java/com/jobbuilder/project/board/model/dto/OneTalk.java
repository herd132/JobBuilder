package com.jobbuilder.project.board.model.dto;

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
public class OneTalk {
	// 임시
<<<<<<< HEAD
	private int onetalkNo;
	private String onetalkContent;
	private String onetalkWriteDate;
	private String onetalkDelFl;
	private int boardNo;
	private int memberNo;
	private int parentonetalkNo;
=======
	private int oneTalkNo;
	private String oneTalkContent;
	private String oneTalkDelFl;
	private String oneTalkWriteDate;
	private int parentoneTalkNo;
	private int boardNo;
	private int memberNo;
>>>>>>> eb77e3de18def775a1ef6431f947ccfbdc67c81f
	
	// 댓글 조회시 회원 프로필, 닉네임
	private String memberName;
	private String profileImg;
	
	// 테이블 조인
	private String workerNickname;
	private String busiNessName;
}

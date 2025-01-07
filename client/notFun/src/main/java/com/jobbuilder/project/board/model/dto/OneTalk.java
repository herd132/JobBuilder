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
	private int oneTalkNo;
	private String oneTalkContent;
	private String oneTalkDelFl;
	private String oneTalkWriteDate;
	private int parentoneTalkNo;
	private int boardNo;
	private int memberNo;
	
	// 댓글 조회시 회원 프로필, 닉네임
	private String memberName;
	private String profileImg;
	
	// 테이블 조인
	private String workerNickname;
	private String busiNessName;
}

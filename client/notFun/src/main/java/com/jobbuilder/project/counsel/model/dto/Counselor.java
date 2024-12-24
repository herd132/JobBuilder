package com.jobbuilder.project.counsel.model.dto;

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
@ToString
@Builder
public class Counselor {
	
	private int memberNo;
	private String memberEmail;
	private String memberPw;
	private String memberName;
	private String memberTel;
	private String enrollDate;
	private int authority;

}
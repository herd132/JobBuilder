package com.jobbuilder.project.toilet.model.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@NoArgsConstructor
@Getter
@AllArgsConstructor
@ToString
@Setter
@Table(name = "TOILET")
public class ToiletEntity {
	
	@Id
	@Column(name = "TOILET_NO")
	private Long toiletNo;
	
	@Column(name = "TOILET_NAME")
	private String toiletName;
	
	@Column(name = "ROAD_NAME")
	private String roadName;
	
	@Column(name = "LATITUDE")
	private String latitude;
	
	@Column(name = "LONGITUDE")
	private String longitude;
}

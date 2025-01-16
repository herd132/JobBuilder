package com.jobbuilder.project.toilet.model.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ToiletDTO {
    private String toiletName;
    private String roadName;
    private String latitude;
    private String longitude;
}
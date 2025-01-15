package com.jobbuilder.project.main.model.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import com.jobbuilder.project.main.model.dto.Brand;

@Mapper
public interface MainMapper {

	/** 메인페이지 Top10 공고(로고)출력 (누적결제금액 많은순)
	 * @return
	 */
	List<Brand> selectTopBrand();

}

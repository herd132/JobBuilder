package com.jobbuilder.project.toilet.model.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.jobbuilder.project.toilet.model.dto.ToiletDTO;
import com.jobbuilder.project.toilet.model.entity.ToiletEntity;

@Repository
public interface TestRepository extends JpaRepository<ToiletEntity, Long> {

	@Query(value = "SELECT DISTINCT TOILET_NAME, ROAD_NAME, LATITUDE, LONGITUDE FROM TOILET " +
            "WHERE LATITUDE BETWEEN :swLat AND :neLat " +
            "AND LONGITUDE BETWEEN :swLng AND :neLng", 
    nativeQuery = true)
	List<Object[]> findToiletsCoordinates(@Param("swLat") String swLat,
	                                       @Param("neLat") String neLat,
	                                       @Param("swLng") String swLng,
	                                       @Param("neLng") String neLng);
}

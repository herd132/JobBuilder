package com.jobbuilder.project.toilet.model.servic;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.jobbuilder.project.toilet.model.dto.ToiletDTO;
import com.jobbuilder.project.toilet.model.repository.TestRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Transactional(transactionManager = "jpaTransactionManager")
@Slf4j
public class ToiletService {

	private final TestRepository toiletRepository;
	
	public List<ToiletDTO> findToiletsCoordinates(String swLat, String neLat, String swLng, String neLng) {
        List<Object[]> results = toiletRepository.findToiletsCoordinates(swLat, neLat, swLng, neLng);

		return results.stream()
				.map(row -> new ToiletDTO((String) row[0], // TOILET_NAME
                        (String) row[1], // ROAD_NAME
                        ((BigDecimal) row[2]).toString(), // LATITUDE -> String 변환
                        ((BigDecimal) row[3]).toString())) // LONGITUDE -> String 변환
				.collect(Collectors.toList());
	}
}

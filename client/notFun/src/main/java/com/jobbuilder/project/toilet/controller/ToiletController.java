package com.jobbuilder.project.toilet.controller;

import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.jobbuilder.project.toilet.model.dto.ToiletDTO;
import com.jobbuilder.project.toilet.model.servic.ToiletService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("toilet")
@Slf4j
@RequiredArgsConstructor
public class ToiletController {

	private final ToiletService toiletService;
	
	@GetMapping("find")
	public List<ToiletDTO> getMethodName(@RequestParam Map<String, String> map) {
		
		List<ToiletDTO> list= toiletService.findToiletsCoordinates(map.get("swLat"), map.get("neLat"), map.get("swLng"), map.get("neLng"));
		
		return list;
	}
	
}

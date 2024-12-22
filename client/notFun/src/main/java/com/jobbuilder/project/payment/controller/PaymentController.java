package com.jobbuilder.project.payment.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.jobbuilder.project.payment.model.service.PaymentService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Controller
@RequestMapping("payment")
@RequiredArgsConstructor
@Slf4j
public class PaymentController {

	private final PaymentService service;
}

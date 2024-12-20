package com.jobbuilder.project;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;

@SpringBootApplication(exclude={SecurityAutoConfiguration.class})
public class NotFunApplication {

	public static void main(String[] args) {
		SpringApplication.run(NotFunApplication.class, args);
	}

}

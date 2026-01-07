package com.waw.waw;

import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;


@SpringBootApplication
@EnableScheduling
@EnableAsync
public class WawApplication {

	public static void main(String[] args) {
		SpringApplication.run(WawApplication.class, args);
	}

}


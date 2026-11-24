package com.scholarhub.attendance;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class ScholarHubApplication {
    public static void main(String[] args) {
        SpringApplication.run(ScholarHubApplication.class, args);
    }
}

package com.expensemaster.infra;

import com.expensemaster.infra.configuration.WebServerConfig;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class Main {
    public static void main(String[] args) {
        SpringApplication.run(WebServerConfig.class, args);
    }
}
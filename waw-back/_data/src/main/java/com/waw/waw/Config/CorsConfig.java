package com.waw.waw.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
        .allowedOrigins(
            "http://102.211.209.131:3010",
            "http://102.211.209.131:3333",
            "https://waw.com.tn",
            "http://waw.com.tn",
            "https://www.waw.com.tn",
            "http://www.waw.com.tn"
        )                        .allowedMethods("*")
                        .allowedHeaders("*");
            }
        };
    }
}

package com.example.demo.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer{

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")  // 允許所有路徑進行跨域請求
                .allowedOrigins("http://localhost:5173")  // 設置允許的前端地址
                .allowedMethods("GET", "POST", "PUT", "DELETE")  // 允許的請求方法
                .allowedHeaders("*")  // 允許的請求頭
                .allowCredentials(true);  // 允許攜帶 cookie
    }
}

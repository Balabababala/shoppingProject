package com.example.demo.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.example.demo.secure.CustomUserDetailsService;

@Configuration
public class SecurityConfig {

    private final CustomUserDetailsService customUserDetailsService;

    public SecurityConfig(CustomUserDetailsService customUserDetailsService) {
        this.customUserDetailsService = customUserDetailsService;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {		//filter
        http
        	.cors(cors -> cors.configurationSource(corsConfigurationSource())) 				  // 使用 Spring Security 的 CORS
            .csrf(csrf -> csrf.disable()) // 若要保留 CSRF，要配合 CSRF token 寫法
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/login", "/api/auth-code", "/api/register").permitAll() // login, captcha, register 放行
//              .requestMatchers("/api/seller/**").authenticated()
                .requestMatchers("/api/seller/**").hasRole("seller")
                .anyRequest().permitAll()														//最後全通過 暫時這樣
            )
            .httpBasic(httpBasic -> {}) // 也可以不用加 httpBasic，單純自己控制 API
            .formLogin(form -> form.disable()); // 禁用 formLogin，改用 API 登入

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:5173"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }


	@Bean
    public AuthenticationManager authenticationManager(HttpSecurity http) throws Exception {	//驗證規則
        AuthenticationManagerBuilder authBuilder = http.getSharedObject(AuthenticationManagerBuilder.class);
        authBuilder.userDetailsService(customUserDetailsService).passwordEncoder(passwordEncoder());
        return authBuilder.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {		//如果要自訂加密方法 實作他
        return new BCryptPasswordEncoder();
    }
}

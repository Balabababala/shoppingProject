//先封印 有空在做

//package com.example.demo.config;
//
//import java.util.List;
//
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.security.config.Customizer;
//import org.springframework.security.config.annotation.web.builders.HttpSecurity;
//import org.springframework.security.web.SecurityFilterChain;
//import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
//import org.springframework.web.cors.CorsConfiguration;
//import org.springframework.web.cors.CorsConfigurationSource;
//import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
//
//import com.example.demo.filter.PassFilter;
//
//@Configuration
//public class SecurityConfig {
//
//    @Bean
//    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
//        http
//            .cors(Customizer.withDefaults()) // 啟用 cors
//            .csrf(csrf -> csrf.disable())    // 視需求關閉 CSRF
//            .authorizeHttpRequests(auth -> auth
//                // 這些路徑不需登入，直接放行
//                .requestMatchers(
//                    "/api/login",
//                    "/api/products/**",
//                    "/api/categories/**",
//                    "/api/auth-code"
//                ).permitAll()
//                // 其他路徑都需要驗證
//                .anyRequest().authenticated()
//            )
//            .addFilterBefore(new PassFilter(), UsernamePasswordAuthenticationFilter.class);
//        return http.build();
//    }
//
//    @Bean
//    CorsConfigurationSource corsConfigurationSource() {
//        CorsConfiguration configuration = new CorsConfiguration();
//        configuration.setAllowedOrigins(List.of("http://localhost:5173"));
//        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
//        configuration.setAllowedHeaders(List.of("*"));
//        configuration.setAllowCredentials(true);
//
//        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
//        source.registerCorsConfiguration("/**", configuration);
//        return source;
//    }
//}

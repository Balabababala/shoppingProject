package com.example.demo.config;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.example.demo.filter.JwtAuthenticationFilter;
import com.example.demo.secure.CustomUserDetailsService;

@Configuration
public class SecurityConfig {
	
	@Autowired
    private CustomUserDetailsService customUserDetailsService;
	
	@Autowired
	private JwtAuthenticationFilter jwtAuthenticationFilter;

     
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {		//filter
        http
        	.cors(cors -> cors.configurationSource(corsConfigurationSource())) 				  // 使用 Spring Security 的 CORS
            .csrf(csrf -> csrf.disable()) // 若要保留 CSRF，要配合 CSRF token 寫法
            .securityContext(context -> context.requireExplicitSave(false))
            .authorizeHttpRequests(auth -> auth
            	.requestMatchers("/uploads/**").permitAll() //	圖庫
            	.requestMatchers("/api/admin/login").permitAll() // admin login
            	.requestMatchers("/api/reviews/product/**","/api/reviews/review-all").permitAll()//ai 用
            	.requestMatchers("/api/search").permitAll()//search 用
                .requestMatchers("/api/login", "/api/auth-code").permitAll()//loggin captcha
                .requestMatchers("/api/register","/api/verify-email").permitAll() // register search 放行  
                .requestMatchers("/api/recommend/products","/api/products/**","/api/categories/**").permitAll()
                .requestMatchers("/api/seller/**").hasAuthority("ROLE_SELLER")
                .requestMatchers("/api/admin/**").hasAuthority("ROLE_ADMIN")
                .requestMatchers("/api/**").authenticated()
                .anyRequest().permitAll()														//最後全通過 暫時這樣
            )
            .formLogin(form -> form.disable()) 			// 禁用 formLogin，改用 API 登入
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
	        .addFilterBefore(jwtAuthenticationFilter, org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
//        config.setAllowedOriginPatterns(List.of("http://localhost:5173"));
        config.setAllowedOriginPatterns(List.of("https://shopping-project-tawny.vercel.app/"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        
     // 靜態資源路徑，不允許憑證，允許所有 origin
        CorsConfiguration staticConfig = new CorsConfiguration();
        staticConfig.addAllowedOriginPattern("*");
        staticConfig.setAllowedMethods(List.of("GET"));
        staticConfig.setAllowedHeaders(List.of("*"));
        staticConfig.setAllowCredentials(false);
        source.registerCorsConfiguration("/uploads/**", staticConfig);
        
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

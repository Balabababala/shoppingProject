package com.example.demo.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.response.ApiResponse;

import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api")
public class LogoutController {
		
	@PostMapping("/logout")
	ResponseEntity<ApiResponse<Void>> logout(HttpSession session){
//		session.removeAttribute("userDto");
		session.invalidate();
		SecurityContextHolder.clearContext();
		return ResponseEntity.ok(ApiResponse.success("登出成功", null));
	}
}

package com.example.demo.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.response.ApiResponse;

import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api")
public class Logout {
		
	@PostMapping("/logout")
	ResponseEntity<ApiResponse<Void>> logout(HttpSession session){
//		session.removeAttribute("userDto");
		
		session.invalidate();
		return ResponseEntity.ok(ApiResponse.success("登出成功", null));
	}
}

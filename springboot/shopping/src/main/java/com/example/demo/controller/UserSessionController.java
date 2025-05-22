package com.example.demo.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.response.ApiResponse;
import com.example.demo.session.SessionUser;

import jakarta.servlet.http.HttpSession;
import org.springframework.web.bind.annotation.GetMapping;



@RestController
@RequestMapping("/api/user")
public class UserSessionController {

	@GetMapping("me")
	public ResponseEntity<ApiResponse<SessionUser>> getRole(HttpSession session) {
		SessionUser sessionUser= (SessionUser)session.getAttribute("sessionUser");
		if(sessionUser==null) {
			return ResponseEntity.status(401).body(ApiResponse.error("尚未登入"));
		}
			return ResponseEntity.ok(ApiResponse.success("取得使用者資料成功",sessionUser));
	}
	
}

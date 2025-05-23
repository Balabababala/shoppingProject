package com.example.demo.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.dto.UserDto;
import com.example.demo.response.ApiResponse;

import jakarta.servlet.http.HttpSession;
import org.springframework.web.bind.annotation.GetMapping;



@RestController
@RequestMapping("/api/user")
public class UserController {

	@GetMapping("me") //contexts 用
	public ResponseEntity<ApiResponse<UserDto>> getRole(HttpSession session) {
		UserDto sessionUser= (UserDto)session.getAttribute("userDto");
		if(sessionUser==null) {
			return ResponseEntity.status(401).body(ApiResponse.error("尚未登入"));
		}
			return ResponseEntity.ok(ApiResponse.success("取得使用者資料成功",sessionUser));
	}
	
}

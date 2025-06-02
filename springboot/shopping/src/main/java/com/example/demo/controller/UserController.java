package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.dto.OrderDto;
import com.example.demo.model.dto.UserDto;
import com.example.demo.response.ApiResponse;
import com.example.demo.service.OrderService;
import com.example.demo.service.UserService;

import jakarta.servlet.http.HttpSession;
import org.springframework.web.bind.annotation.GetMapping;



@RestController
@RequestMapping("/api/user")
public class UserController {


	
	@Autowired
	private OrderService orderService;
	
	@GetMapping("me") //contexts 用
	public ResponseEntity<ApiResponse<UserDto>> getRole(HttpSession session) {
		UserDto UserDto= (UserDto)session.getAttribute("userDto");
		if(UserDto==null) {
			return ResponseEntity.status(401).body(ApiResponse.error("尚未登入"));
		}
			return ResponseEntity.ok(ApiResponse.success("取得使用者資料成功",UserDto));
	}
	
	@GetMapping("/default-order-info")
	public ResponseEntity<ApiResponse<OrderDto>> getUserOrderInfo(HttpSession session) {
		
		UserDto userDto= (UserDto)session.getAttribute("userDto");
		if(userDto==null) {
			return ResponseEntity.status(401).body(ApiResponse.error("尚未登入"));
		}
		OrderDto orderDto= orderService.getUserDefaultToOrderDto(userDto);
		
		return ResponseEntity.ok(ApiResponse.success("取得使用者資料成功",orderDto));
	}
}

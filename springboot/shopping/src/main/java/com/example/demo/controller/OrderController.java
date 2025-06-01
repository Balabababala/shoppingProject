package com.example.demo.controller;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.dto.OrderRequest;
import com.example.demo.model.dto.UserDto;
import com.example.demo.response.ApiResponse;
import com.example.demo.service.OrderService;


import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api/order")
public class OrderController {

	@Autowired
	private OrderService orderService;
	
	
	//
	@PostMapping("/create")
	public ResponseEntity<ApiResponse<List<Void>>> getTopCatogory(@RequestBody OrderRequest orderRequest,HttpSession session)  {
		if(session==null) {
			return ResponseEntity.badRequest().body(ApiResponse.error("你怎麼進來的?"));
		}
		UserDto userDto =(UserDto)session.getAttribute("userDto");
		orderService.createOrder(orderRequest, userDto.getUserId());
		return ResponseEntity.ok(ApiResponse.success("更新成功", null));
	}
}

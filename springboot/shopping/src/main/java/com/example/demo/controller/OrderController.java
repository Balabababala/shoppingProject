package com.example.demo.controller;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.dto.OrderDto;
import com.example.demo.model.dto.UserDto;
import com.example.demo.response.ApiResponse;
import com.example.demo.service.OrderService;


import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api/order")
public class OrderController {

	@Autowired
	private OrderService orderService;
	
	@PostMapping("/create")
	public ResponseEntity<ApiResponse<List<Void>>> getTopCatogory(@RequestBody OrderDto orderRequest,HttpSession session)  {
		UserDto userDto = (UserDto) session.getAttribute("userDto");
		if(userDto==null) {
			return ResponseEntity.badRequest().body(ApiResponse.error("你怎麼進來的?"));
		}

		orderService.createOrder(orderRequest, userDto.getUserId());
		return ResponseEntity.ok(ApiResponse.success("結帳成功", null));
	}
}

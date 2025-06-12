package com.example.demo.controller;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.dto.CreateOrderDto;
import com.example.demo.model.dto.OrderResponse;
import com.example.demo.model.dto.UserDto;
import com.example.demo.response.ApiResponse;
import com.example.demo.service.OrderService;


import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api")
public class OrderController {

	@Autowired
	private OrderService orderService;
	
	@PostMapping("/order/create")
	public ResponseEntity<ApiResponse<List<Void>>> createOrder(@RequestBody CreateOrderDto orderRequest,HttpSession session)  {
		UserDto userDto = (UserDto) session.getAttribute("userDto");
		if(userDto==null) {
			return ResponseEntity.badRequest().body(ApiResponse.error("你怎麼進來的?"));
		}

		orderService.createOrder(orderRequest, userDto.getUserId());
		return ResponseEntity.ok(ApiResponse.success("結帳成功", null));
	}
	//看使用者(買方)訂單
	@GetMapping("/orders/{userId}")
	public ResponseEntity<ApiResponse<List<OrderResponse>>> getOrdersByBuyerId(@PathVariable Long userId,HttpSession session)  {
		UserDto userDto = (UserDto) session.getAttribute("userDto");
		if(userDto.getUserId()!=userId) {
			return ResponseEntity.badRequest().body(ApiResponse.error("你怎麼進來的?"));
		}

		List<OrderResponse> orderResponses= orderService.getOrderByBuyerId(userId);
		return ResponseEntity.ok(ApiResponse.success("取得資料成功", orderResponses));
	}
	//看使用者(賣家)訂單
	@GetMapping("/orders/seller/{userId}")
	public ResponseEntity<ApiResponse<List<OrderResponse>>> getOrdersBySellerId(@PathVariable Long userId,HttpSession session)  {
		UserDto userDto = (UserDto) session.getAttribute("userDto");
		if(userDto.getUserId()!=userId) {
			return ResponseEntity.badRequest().body(ApiResponse.error("你怎麼進來的?"));
		}

		List<OrderResponse> orderResponses= orderService.getOrderBySellerId(userId);
		return ResponseEntity.ok(ApiResponse.success("取得資料成功", orderResponses));
	}
	
	
}

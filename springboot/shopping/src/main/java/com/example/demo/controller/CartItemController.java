package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.dto.AddCartItemRequest;
import com.example.demo.model.dto.CartItemResponse;
import com.example.demo.model.dto.UserDto;
import com.example.demo.response.ApiResponse;
import com.example.demo.service.CartItemService;

import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api/cart")
public class CartItemController {
	@Autowired
	private CartItemService cartItemService; 
	
	@GetMapping //contexts 用
	public ResponseEntity<ApiResponse<List<CartItemResponse>>> getCart(HttpSession session)   {
		UserDto sessionUser= (UserDto)session.getAttribute("sessionUser");
		return ResponseEntity.ok(ApiResponse.success("取購物車成功", cartItemService.getCart(sessionUser.getUserId())));
	}
	
	@PostMapping("/add")
	public ResponseEntity<ApiResponse<Object>> addCart(HttpSession session,@RequestBody AddCartItemRequest addCartItemRequest){
		UserDto sessionUser= (UserDto)session.getAttribute("sessionUser");
		if(sessionUser==null) {
			return ResponseEntity.badRequest().body(ApiResponse.error("你沒登入是怎麼進來的"));
		}
		
		if(sessionUser.getUserId().equals(addCartItemRequest.getUserId())) {
			cartItemService.addCartItem(addCartItemRequest.getUserId(), addCartItemRequest.getProductId(), addCartItemRequest.getQuantity());
			return ResponseEntity.ok(ApiResponse.success("加入成功",null));
		}
		return ResponseEntity.badRequest().body(ApiResponse.error("不是 你他媽怎麼做到的"));
	}
}

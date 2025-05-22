package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.dto.CartDTO;
import com.example.demo.response.ApiResponse;
import com.example.demo.service.CartItemService;
import com.example.demo.session.SessionUser;

import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api/cart")
public class CartController {
	@Autowired
	private CartItemService cartItemService; 
	
	@GetMapping
	public ResponseEntity<ApiResponse<List<CartDTO>>> getcart(HttpSession session)   {
		SessionUser sessionUser= (SessionUser)session.getAttribute("sessionUser");
		return ResponseEntity.ok(ApiResponse.success("取購物車成功", cartItemService.getCart(sessionUser.getUserId())));
	}
}

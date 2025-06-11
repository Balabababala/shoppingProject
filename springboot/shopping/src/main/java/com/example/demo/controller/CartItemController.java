package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.dto.AddCartItemRequest;
import com.example.demo.model.dto.CartItemResponse;
import com.example.demo.model.dto.UserDto;
import com.example.demo.response.ApiResponse;
import com.example.demo.service.CartItemService;
import com.example.demo.service.UserService;

import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api")
public class CartItemController {
	@Autowired
	private CartItemService cartItemService; 
	
	
	@GetMapping ("/cart")//contexts 用
	public ResponseEntity<ApiResponse<List<CartItemResponse>>> getCart(HttpSession session)   {
		UserDto userDto= (UserDto)session.getAttribute("userDto");
		return ResponseEntity.ok(ApiResponse.success("取購物車成功", cartItemService.getCart(userDto.getUserId())));
	}
	
	@PostMapping("/cart/add")
	public ResponseEntity<ApiResponse<Object>> addCart(HttpSession session,@RequestBody AddCartItemRequest addCartItemRequest){
		UserDto userDto= (UserDto)session.getAttribute("userDto");
		cartItemService.addOrUpdateCartItem(userDto.getUserId(), addCartItemRequest.getProductId(), addCartItemRequest.getQuantity());
		return ResponseEntity.ok(ApiResponse.success("加入成功",null));
	}
	
	@DeleteMapping("/cart/{productId}")
	public ResponseEntity<ApiResponse<Object>> deleteCart(HttpSession session,@PathVariable Long productId){
		UserDto userDto= (UserDto)session.getAttribute("userDto");
		cartItemService.deleteByUserIdAndProductId(userDto.getUserId(),productId);
		return ResponseEntity.ok(ApiResponse.success("刪除成功",null));
		
	}
	
	@DeleteMapping("/cart/clear")	// cartItem 清除
	public ResponseEntity<ApiResponse<List<Void>>> clearCart(HttpSession session)   {
		UserDto userDto= (UserDto)session.getAttribute("userDto");
		cartItemService.clearCart(userDto.getUserId());
		return ResponseEntity.ok(ApiResponse.success("刪購物車成功",null));
	}
}

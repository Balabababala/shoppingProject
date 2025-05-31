package com.example.demo.controller;

import java.net.http.HttpRequest;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.dto.CategoryResponse;
import com.example.demo.model.dto.OrderRequest;
import com.example.demo.model.dto.UserDto;
import com.example.demo.model.entity.Product;
import com.example.demo.repository.OrderRepository;
import com.example.demo.response.ApiResponse;
import com.example.demo.service.CartItemService;
import com.example.demo.service.OrderService;
import com.example.demo.service.ProductService;

import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api/order")
public class OrderController {

	@Autowired
	private OrderService orderService;
	
	@Autowired
	private ProductService productService;
	
	@Autowired
	private CartItemService cartItemService;
	
	
	@PostMapping("/create")
	public ResponseEntity<ApiResponse<List<CategoryResponse>>> getTopCatogory(@RequestBody OrderRequest orderRequest,HttpSession session)  {
		if(session==null) {
			return ResponseEntity.badRequest().body(ApiResponse.error("你怎麼進來的?"));
		}
		
		UserDto userDto =(UserDto)session.getAttribute("userDto");
		orderService.CreateOrder(null);
		cartItemService.getCart(userDto.getUserId()).stream();
		productService.minusProductByid(null, null);
		
		
		return ResponseEntity.ok(ApiResponse.success("最上層類別取得成功", categoryService.findTopCategory()));
	}
}

package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.Mapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.exception.ShoppingException;
import com.example.demo.model.dto.FavoriteDto;
import com.example.demo.model.dto.UserDto;
import com.example.demo.model.entity.Favorite;
import com.example.demo.response.ApiResponse;
import com.example.demo.service.FavoriteService;

import jakarta.servlet.http.HttpSession;



@RestController
@RequestMapping("/api")
public class FavoriteController {
	
	@Autowired
	private FavoriteService favoriteService;
	
	@PostMapping("/favorites")   	//新增
	public ResponseEntity<ApiResponse<Void>> addFavorite(HttpSession session,@RequestBody FavoriteDto favoriteDto){
		UserDto userDto= (UserDto)session.getAttribute("userDto");
		try {
			favoriteService.addFavoriteByUserIdAndProductId(userDto.getUserId(), favoriteDto.getProductId());
		} catch (ShoppingException e) {
			return ResponseEntity.ok(ApiResponse.success("已加入收藏", null));
		}
		return ResponseEntity.ok(ApiResponse.success("收藏成功", null));
	}	
	
	
	@DeleteMapping("/favorites/{productId}")
	public ResponseEntity<ApiResponse<Void>> deleteFavorite(HttpSession session,@PathVariable Long productId){
		UserDto userDto= (UserDto)session.getAttribute("userDto");
		try {
			favoriteService.deleteFavoriteByUserIdAndProductId(userDto.getUserId(), productId);
		} catch (ShoppingException e) {
			return ResponseEntity.ok(ApiResponse.success("未加入收藏", null));
		}
		return ResponseEntity.ok(ApiResponse.success("刪除收藏成功", null));
	}
	
	
	@GetMapping("/favorites/{userId}/favorites")
	public ResponseEntity<ApiResponse<List<FavoriteDto>>> getFavorite(HttpSession session,@PathVariable Long userId){
		UserDto userDto= (UserDto)session.getAttribute("userDto");
		if(userDto.getUserId().equals(userId)) {
			return ResponseEntity.ok(ApiResponse.success("找到收藏成功", favoriteService.findFavoriteByUserId(userId)));
		}
		return ResponseEntity.badRequest().body(ApiResponse.error("你在幹嘛 想偷看別人的"));
	}
	
	@GetMapping("/favorites/check")
	public ResponseEntity<ApiResponse<Boolean>> checkFavorite(HttpSession session,@RequestParam Long userId,@RequestParam Long productId ){
		UserDto userDto= (UserDto)session.getAttribute("userDto");
		if(userDto.getUserId().equals(userId)) {
			return ResponseEntity.ok(ApiResponse.success("成功", !favoriteService.findByUserIdAndProductId(userId, productId).isEmpty()));
		}
		return ResponseEntity.badRequest().body(ApiResponse.error("你在幹嘛 想偷看別人的"));
	}

	
}

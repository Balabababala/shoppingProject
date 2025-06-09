package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.dto.RecentlyViewedResponse;
import com.example.demo.response.ApiResponse;
import com.example.demo.service.RecentlyViewedService;

@RestController
@RequestMapping("/api")

public class RecentlyViewedController {
	@Autowired
	private RecentlyViewedService recentlyViewedService; 
	
	@GetMapping("/recent/buyer/{userId}")
	public ResponseEntity<ApiResponse<List<RecentlyViewedResponse>>> findBuyerRecentlyViewed(@PathVariable Long userId){
		return ResponseEntity.ok(ApiResponse.success("獲取資料成功", recentlyViewedService.getRecentlyViewedByUserId(userId)));//對應值
	}
}

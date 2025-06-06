package com.example.demo.controller;

import java.net.http.HttpRequest;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.dto.NotificationDto;
import com.example.demo.model.dto.UserDto;
import com.example.demo.response.ApiResponse;
import com.example.demo.service.NotificationService;

import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api/notification")
public class NotificationController {
	
	@Autowired
	private NotificationService notificationService;
	
	@GetMapping
	ResponseEntity<ApiResponse<List<NotificationDto>>> getNotification(HttpSession session){
		try {
			UserDto userDto= (UserDto)session.getAttribute("userDto");
			return ResponseEntity.ok(ApiResponse.success("通知取得成功", notificationService.findNotificationsByUsertiNotificationResponse(userDto.getUserId())));
		} catch (Exception e) {
			return ResponseEntity.badRequest().body(ApiResponse.error("通知取得失敗"));
		}
	}
	
	@PostMapping("/{id}")
	ResponseEntity<ApiResponse<Void>> markAsRead(HttpSession session,@PathVariable Long id){
		try {
			UserDto userDto= (UserDto)session.getAttribute("userDto");
			notificationService.markNotificationAsReadByNotificationId(id,userDto.getUserId());
			return ResponseEntity.ok(ApiResponse.success("執行成功", null));
		} catch (Exception e) {
			return ResponseEntity.badRequest().body(ApiResponse.error("執行失敗"));
		}
	}
}

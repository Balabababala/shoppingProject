package com.example.demo.controller.front;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.dto.NotificationDto;
import com.example.demo.response.ApiResponse;
import com.example.demo.secure.CustomUserDetails;
import com.example.demo.service.front.NotificationService;



@RestController
@RequestMapping("/api")
public class NotificationController {
	
	@Autowired
	private NotificationService notificationService;
	
	 private CustomUserDetails getCurrentUserDetails() {
	        return (CustomUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
	    }
	 
	//看通知訊息 (改成已讀)
		@PostMapping("/notification/{id}")
		ResponseEntity<ApiResponse<Void>> markAsRead(@PathVariable Long id){
			
			CustomUserDetails customUserDetails= getCurrentUserDetails();
			try {	
				notificationService.markNotificationAsReadByNotificationId(id,customUserDetails.getUser().getId());
				return ResponseEntity.ok(ApiResponse.success("執行成功", null));
			} catch (Exception e) {
				return ResponseEntity.badRequest().body(ApiResponse.error("執行失敗"));
			}
		}
		
	//看通知訊息列表
	@GetMapping("/notification")
	ResponseEntity<ApiResponse<List<NotificationDto>>> getNotification(){
		CustomUserDetails customUserDetails= getCurrentUserDetails();
		try {
			return ResponseEntity.ok(ApiResponse.success("通知取得成功", notificationService.findNotificationsByUsertiNotificationResponse(customUserDetails.getUser().getId())));
		} catch (Exception e) {
			return ResponseEntity.badRequest().body(ApiResponse.error("通知取得失敗"));
		}
	}
	
	
}

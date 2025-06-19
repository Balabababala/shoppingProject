package com.example.demo.controller.admin;



import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.model.dto.AdminNotificationDto;
import com.example.demo.model.dto.NotificationDto;
import com.example.demo.response.ApiResponse;
import com.example.demo.service.admin.AdminNotificationService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/notifications")
public class AdminNotificationController {

	@Autowired 
    private AdminNotificationService adminNotificationService;

    // 取得指定使用者的所有通知
    @GetMapping("/user")
    public ResponseEntity<ApiResponse<List<AdminNotificationDto>>> getUserNotifications() {
        List<AdminNotificationDto> list = adminNotificationService.getAllNotifications();
        return ResponseEntity.ok(ApiResponse.success("取得使用者通知成功", list));
    }

    // 新增通知
    @PostMapping
    public ResponseEntity<ApiResponse<Void>> createNotification(@RequestBody AdminNotificationDto adminNotificationDto) {
    	adminNotificationService.createNotification(adminNotificationDto);
        return ResponseEntity.ok(ApiResponse.success("新增通知成功", null));
    }

    // 刪除通知
    @DeleteMapping("/{id}/user/{userId}")
    public ResponseEntity<ApiResponse<Void>> deleteNotification(@PathVariable Long id, @PathVariable Long userId) {
    	adminNotificationService.deleteNotification(id, userId);
        return ResponseEntity.ok(ApiResponse.success("刪除通知成功", null));
    }
}

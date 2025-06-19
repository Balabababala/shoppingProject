package com.example.demo.service.admin;



import java.util.List;

import com.example.demo.model.dto.AdminNotificationDto;


public interface AdminNotificationService {
	List<AdminNotificationDto> getAllNotifications();						//取使用者通知
    void createNotification(AdminNotificationDto adminNotificationDto);		//加某個使用者通知
    void deleteNotification(Long id, Long userId);							//刪某個使用者通知
}

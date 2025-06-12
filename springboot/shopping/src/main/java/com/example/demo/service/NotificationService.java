package com.example.demo.service;

import java.util.List;
import java.util.Optional;

import com.example.demo.model.dto.NotificationDto;
import com.example.demo.model.entity.Notification;

public interface NotificationService {
	

	//邏輯
	
	void markNotificationAsReadByNotificationId(Long notificationId,Long userId);//改已讀
	
	List<NotificationDto> findNotificationsByUsertiNotificationResponse(Long userId);//看通知訊息 by usrId
}

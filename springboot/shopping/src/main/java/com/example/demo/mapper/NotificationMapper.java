package com.example.demo.mapper;


import com.example.demo.model.dto.NotificationDto;
import com.example.demo.model.entity.Notification;

public class NotificationMapper {

	public static NotificationDto toDto(Notification notification) {
		NotificationDto notificationDto = new NotificationDto();
		if(notification.getUser()==null) {
			notificationDto.setIsGlobal(true);
		}else {
			notificationDto.setIsGlobal(false);
		}
		notificationDto.setId(notification.getId());
		notificationDto.setMessage(notification.getMessage());
		notificationDto.setStatus(notification.getStatus());
		notificationDto.setType(notification.getType());
	
		return notificationDto;
	}
}

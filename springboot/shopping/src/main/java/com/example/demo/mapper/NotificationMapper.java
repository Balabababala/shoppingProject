package com.example.demo.mapper;

import com.example.demo.model.dto.NotificationDto;
import com.example.demo.model.entity.Notification;
import com.example.demo.repository.NotificationRepository;

public class NotificationMapper {

	public static NotificationDto toDto(Notification notification) {
		return new NotificationDto(
				notification.getId(),
				notification.getType(),
				notification.getMessage(),
				notification.getStatus());				
	}
	
}

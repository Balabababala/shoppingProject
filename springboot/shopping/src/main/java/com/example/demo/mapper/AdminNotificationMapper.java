package com.example.demo.mapper;


import com.example.demo.model.dto.AdminNotificationDto;
import com.example.demo.model.entity.Notification;
import com.example.demo.model.entity.User;

public class AdminNotificationMapper {

    public static AdminNotificationDto toDto(Notification notification) {
        if (notification == null) return null;
        AdminNotificationDto adminNotificationDto = new AdminNotificationDto();
        adminNotificationDto.setId(notification.getId());
        adminNotificationDto.setType(notification.getType());
        adminNotificationDto.setMessage(notification.getMessage());
        adminNotificationDto.setStatus(notification.getStatus());
        adminNotificationDto.setCreatedAt(notification.getCreatedAt());
        adminNotificationDto.setUpdatedAt(notification.getUpdatedAt());
        if (notification.getUser() != null) {
        	adminNotificationDto.setUserId(notification.getUser().getId());
        	adminNotificationDto.setUserName(notification.getUser().getUsername());
        } else {
        	adminNotificationDto.setUserId(null);
        	adminNotificationDto.setUserName("全站通知");
        }
        return adminNotificationDto;
    }

    public static Notification toEntity(AdminNotificationDto adminNotificationDto, User user) {
        if (adminNotificationDto == null) return null;
        Notification entity = new Notification();
        entity.setId(adminNotificationDto.getId());
        entity.setType(adminNotificationDto.getType());
        entity.setMessage(adminNotificationDto.getMessage());
        entity.setStatus(adminNotificationDto.getStatus());
        entity.setUser(user);
        return entity;
    }
}

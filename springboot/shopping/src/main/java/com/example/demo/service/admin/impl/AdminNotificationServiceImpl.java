package com.example.demo.service.admin.impl;


import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.mapper.AdminNotificationMapper;
import com.example.demo.model.dto.AdminNotificationDto;
import com.example.demo.model.dto.NotificationDto;
import com.example.demo.model.entity.Notification;
import com.example.demo.model.entity.User;
import com.example.demo.repository.NotificationRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.admin.AdminNotificationService;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
public class AdminNotificationServiceImpl implements AdminNotificationService {

	@Autowired
    private NotificationRepository notificationRepository;
	
	@Autowired
    private  UserRepository userRepository;

	
    @Override
    @Transactional(readOnly = true)
    public List<AdminNotificationDto> getAllNotifications() {
        List<Notification> list = notificationRepository.findAll();
        return list.stream().map(AdminNotificationMapper::toDto).toList();
    }

    @Override
    public void createNotification(AdminNotificationDto adminNotificationDto) {
        Notification entity = new Notification();
        entity.setType(adminNotificationDto.getType());
        entity.setMessage(adminNotificationDto.getMessage());
        entity.setStatus(adminNotificationDto.getStatus());

        if (adminNotificationDto.getUserId() != null) {
            User user = userRepository.findById(adminNotificationDto.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
            entity.setUser(user);
        } else {
            // user為null表示全站通知
            entity.setUser(null);
        }

        notificationRepository.save(entity);
    }



    @Override
    public void deleteNotification(Long id) {
    	
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Notification not found"));
       
        notificationRepository.delete(notification);
    }
}

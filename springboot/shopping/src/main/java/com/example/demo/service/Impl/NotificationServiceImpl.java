package com.example.demo.service.Impl;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.exception.ShoppingException;
import com.example.demo.mapper.NotificationMapper;
import com.example.demo.model.dto.NotificationDto;
import com.example.demo.model.entity.Notification;
import com.example.demo.model.enums.NotificationStatus;
import com.example.demo.repository.NotificationRepository;
import com.example.demo.service.NotificationService;

@Service
public class NotificationServiceImpl implements NotificationService{

	@Autowired
	private NotificationRepository notificationRepository;
	
	//repository
	
	@Override
	public void markAsReadByNotificationId(Long notificationId) {		
		notificationRepository.markAsReadByNotificationId(notificationId);
	};
	
	@Override
	public Optional<Notification> findByNotificationId(Long notificationId){
		return notificationRepository.findByNotificationId(notificationId);
	};
	
	@Override
	public List<Notification> findByUserId(Long userId){		
		return notificationRepository.findByUserId(userId);
	}

	
	//邏輯
	
	
	@Override
	public void markNotificationAsReadByNotificationId(Long notificationId,Long userId) { //+判斷 是否是使用者的通知 雖然不太可能發生
		Optional<Notification> opt= findByNotificationId(notificationId);
		if(opt.get().getUser().getId().equals(userId)) {
			if(opt.get().getStatus()!=NotificationStatus.ARCHIVED) {
				markAsReadByNotificationId(notificationId);
			}
			return;
		}
		throw new ShoppingException("你是怎麼做到的?");
	};
	
	@Override
	public List<NotificationDto> findNotificationsByUsertiNotificationResponse(Long userId) {
		return findByUserId(userId).stream()
								   .map(NotificationMapper::toDto)
								   .toList();
	};
	
}

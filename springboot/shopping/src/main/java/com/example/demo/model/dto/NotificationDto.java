package com.example.demo.model.dto;

import com.example.demo.model.enums.NotificationStatus;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class NotificationDto {
	private Long id;	
	private String type;
	private String message; 
	private NotificationStatus status;
}

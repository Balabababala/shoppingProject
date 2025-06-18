package com.example.demo.service.admin;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.demo.model.dto.AdminOrderDto;



@Service
public interface AdminOrderService {

	List<AdminOrderDto> searchOrdersNoPage(String orderNumber, String userName) ;

	AdminOrderDto getOrderById(Long orderId);
	
	
}

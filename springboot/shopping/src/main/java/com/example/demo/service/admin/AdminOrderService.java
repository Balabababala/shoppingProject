package com.example.demo.service.admin;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.stereotype.Service;

import com.example.demo.model.dto.AdminOrderDto;
import com.example.demo.model.dto.AdminOrderEditDto;



@Service
public interface AdminOrderService {

	List<AdminOrderEditDto> searchOrdersNoPage(String orderNumber, String userName) ;

	AdminOrderEditDto getOrderById(Long orderId);

	AdminOrderEditDto updateOrder(Long orderId, AdminOrderEditDto dto);

	long count();

	BigDecimal calculateTotalSales();
	
	
}

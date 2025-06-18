package com.example.demo.service.admin.impl;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.jaxb.SpringDataJaxb.OrderDto;
import org.springframework.stereotype.Service;

import com.example.demo.mapper.AdminOrderDtoMapper;
import com.example.demo.mapper.OrderMapper;
import com.example.demo.model.dto.AdminOrderDto;
import com.example.demo.model.entity.Order;
import com.example.demo.repository.OrderRepository;
import com.example.demo.service.admin.AdminOrderService;

@Service
public class AdminOrderServiceImpl implements AdminOrderService{
    
    @Autowired
    private OrderRepository orderRepository;

    public List<AdminOrderDto> searchOrdersNoPage(String orderNumber, String userName) {
    	return orderRepository.searchOrdersNoPage(orderNumber, userName).stream()
		    															.map(AdminOrderDtoMapper::toDto)
		    															.toList();
    }
    
    @Override
    public AdminOrderDto getOrderById(Long orderId) {
        return orderRepository.findById(orderId)
                .map(AdminOrderDtoMapper::toDto)
                .orElse(null);
    }
}

package com.example.demo.service.admin.impl;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.jaxb.SpringDataJaxb.OrderDto;
import org.springframework.stereotype.Service;

import com.example.demo.mapper.AdminOrderDtoMapper;
import com.example.demo.mapper.AdminOrderEditDtoMapper;
import com.example.demo.mapper.OrderMapper;
import com.example.demo.model.dto.AdminOrderDto;
import com.example.demo.model.dto.AdminOrderEditDto;
import com.example.demo.model.entity.Order;
import com.example.demo.repository.OrderRepository;
import com.example.demo.service.admin.AdminOrderService;

@Service
public class AdminOrderServiceImpl implements AdminOrderService{
    
    @Autowired
    private OrderRepository orderRepository;

    @Override
    public List<AdminOrderEditDto> searchOrdersNoPage(String orderNumber, String userName) {
    	return orderRepository.searchOrdersNoPage(orderNumber, userName).stream()
		    															.map(AdminOrderEditDtoMapper::toDto)
		    															.toList();
    }
    
    @Override
    public AdminOrderEditDto getOrderById(Long orderId) {
        return orderRepository.findById(orderId)
                .map(AdminOrderEditDtoMapper::toDto)
                .orElse(null);
    }
    
    @Override
    public AdminOrderEditDto updateOrder(Long orderId, AdminOrderEditDto dto) {
        // 找出要更新的訂單
        Order order = orderRepository.findById(orderId).orElse(null);
        if (order == null) {
            return null; // 找不到訂單回傳 null
        }

        // 利用 mapper 更新實體資料（請確保 AdminOrderEditDtoMapper 有這方法）
        AdminOrderEditDtoMapper.updateEntityFromDto(order, dto);

        // 若有需要可在此驗證資料（例如狀態值是否合理等）

        // 儲存更新後的訂單
        Order updatedOrder = orderRepository.save(order);

        // 回傳更新後的 DTO
        return AdminOrderEditDtoMapper.toDto(updatedOrder);
    }
}

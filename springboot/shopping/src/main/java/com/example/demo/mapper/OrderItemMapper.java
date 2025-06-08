package com.example.demo.mapper;

import java.math.BigDecimal;

import com.example.demo.model.dto.OrderItemResponse;
import com.example.demo.model.entity.OrderItem;

public class OrderItemMapper {
	public static OrderItemResponse toDto(OrderItem item) {
	        OrderItemResponse orderItemResponse = new OrderItemResponse();
	        orderItemResponse.setProductId(item.getProduct().getId());
	        orderItemResponse.setProductName(item.getProduct().getName());
	        orderItemResponse.setQuantity(item.getQuantity());
	        orderItemResponse.setUnitPrice(item.getUnitPrice());
	        orderItemResponse.setSubtotal(item.getUnitPrice().multiply(new BigDecimal(item.getQuantity())));
	        return orderItemResponse;
	    }
	
}

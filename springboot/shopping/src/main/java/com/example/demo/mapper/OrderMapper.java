package com.example.demo.mapper;

import java.util.List;
import java.util.stream.Collectors;

import com.example.demo.model.dto.OrderItemResponse;
import com.example.demo.model.dto.OrderResponse;
import com.example.demo.model.entity.Order;

public class OrderMapper {
	
	
   public static OrderResponse toDto(Order order) {
	   OrderResponse orderResponse =new OrderResponse();
	   orderResponse.setId(order.getId());
	   orderResponse.setBuyerId(order.getBuyer().getId());
	   orderResponse.setSellerId(order.getSeller().getId());
	   orderResponse.setOrderDate(order.getOrderDate());
	   orderResponse.setOrderStatus(order.getOrderStatus().name());
	   orderResponse.setPaymentStatus(order.getPaymentStatus().name());
	   orderResponse.setShipmentStatus(order.getShipmentStatus().name());
	   orderResponse.setShippingMethod(order.getShippingMethod());
	   orderResponse.setPaymentMethod(order.getPaymentMethod());
	   orderResponse.setTrackingNumber(order.getTrackingNumber());
	   orderResponse.setReceiverName(order.getReceiverName());
	   orderResponse.setReceiverPhone(order.getReceiverPhone());
	   orderResponse.setShippingAddress(order.getShippingAddress());
	   orderResponse.setTotalAmount(order.getTotalAmount());
	   orderResponse.setNotes(order.getNotes());
	   orderResponse.setCreatedAt(order.getCreatedAt());
	   orderResponse.setUpdatedAt(order.getUpdatedAt());
	   
	   List<OrderItemResponse> itemResponses = order.getOrderItems().stream()
		        .map(OrderItemMapper::toDto)
		        .toList();

	   orderResponse.setItems(itemResponses);
	   return orderResponse ;
   } 
}

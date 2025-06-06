package com.example.demo.mapper;


import java.math.BigDecimal;

import com.example.demo.model.dto.OrderDto;
import com.example.demo.model.entity.Order;
import com.example.demo.model.entity.User;




//要其他傳入值
public class OrderMapper {	
	
	public static Order toEntity(OrderDto orderRequest,User buyer,User seller,BigDecimal totalAmount) {
		Order order= new Order();
		order.setBuyer(buyer);
		order.setSeller(seller);
		order.setShippingMethod(orderRequest.getShippingMethod());
		order.setPaymentMethod(orderRequest.getPaymentMethod());
		order.setReceiverName(orderRequest.getReceiverName());
		order.setReceiverPhone(orderRequest.getReceiverPhone());
		order.setTotalAmount(totalAmount);
		order.setShippingAddress(orderRequest.getShippingAddress());
		order.setNotes(orderRequest.getNotes());
        return order;
    }
}

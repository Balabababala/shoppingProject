package com.example.demo.mapper;


import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.example.demo.model.dto.CreateOrderDto;
import com.example.demo.model.entity.Order;
import com.example.demo.model.entity.User;
import com.example.demo.model.enums.OrderStatus;
import com.example.demo.model.enums.PaymentStatus;
import com.example.demo.model.enums.ShipmentStatus;




//要其他傳入值
public class CreateOrderMapper {	
	
	public static Order toEntity(CreateOrderDto orderRequest,User buyer,User seller,BigDecimal totalAmount) {
		Order order= new Order();
		order.setBuyer(buyer);
		order.setSeller(seller);
		order.setShippingMethod(orderRequest.getShippingMethod());
		order.setPaymentMethod(orderRequest.getPaymentMethod());
		order.setReceiverName(orderRequest.getReceiverName());
		order.setReceiverPhone(orderRequest.getReceiverPhone());
		order.setTotalAmount(totalAmount);
		order.setOrderStatus(OrderStatus.PENDING);
		order.setPaymentStatus(PaymentStatus.PENDING);
		order.setShipmentStatus(ShipmentStatus.NOT_SHIPPED);
		order.setShippingAddress(orderRequest.getShippingAddress());
		order.setNotes(orderRequest.getNotes());
        return order;
    }
}

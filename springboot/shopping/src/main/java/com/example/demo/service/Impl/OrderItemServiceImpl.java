package com.example.demo.service.Impl;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

import com.example.demo.model.entity.OrderItem;
import com.example.demo.model.entity.Product;
import com.example.demo.repository.CartItemRepository;
import com.example.demo.repository.OrderItemRepository;
import com.example.demo.service.OrderItemService;

public class OrderItemServiceImpl implements OrderItemService{

	@Autowired
	private OrderItemRepository orderItemRepository;
	
	@Autowired
	private CartItemRepository cartItemRepository;
	
	@Override
	public void addOrderItem(List<OrderItem> orderItems) {
		for(OrderItem orderItem:orderItems) {
			orderItemRepository.save(orderItem);
		}		
	}

	@Override
	public List<OrderItem> CartItemToOrderItemByUserId(Long UserId) {
		return
				cartItemRepository.findByUserId(UserId).stream()
														.map(cartItem->{
																		Product product=cartItem.getProduct();
																		OrderItem orderItem =new OrderItem();
																		orderItem.setOrderId(cartItem.getId());
																		orderItem.setProductId(product.getId());
																		orderItem.setQuantity(cartItem.getQuantity());
																		orderItem.setUnitPrice(product.getPrice());
																		orderItem.setTotalPrice(product.getPrice().multiply(BigDecimal.valueOf(cartItem.getQuantity())));
																		return orderItem;
																		})
														.toList();

	}
	
	
	
}

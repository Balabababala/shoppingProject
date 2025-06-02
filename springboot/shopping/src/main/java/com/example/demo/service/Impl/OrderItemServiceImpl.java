package com.example.demo.service.Impl;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.model.entity.CartItem;
import com.example.demo.model.entity.OrderItem;
import com.example.demo.model.entity.Product;
import com.example.demo.repository.CartItemRepository;
import com.example.demo.repository.OrderItemRepository;
import com.example.demo.service.OrderItemService;

@Service
public class OrderItemServiceImpl implements OrderItemService{

	@Autowired
	private OrderItemRepository orderItemRepository;
	
	@Override
	public void addOrderItem(List<OrderItem> orderItems) {
		for(OrderItem orderItem:orderItems) {
			orderItemRepository.save(orderItem);
		}		
	}

	@Override
	public OrderItem cartItemToOrderItem(CartItem cartItem) {
								Product product=cartItem.getProduct();
								OrderItem orderItem =new OrderItem();
								orderItem.setOrderId(cartItem.getId());
								orderItem.setProductId(product.getId());
								orderItem.setQuantity(cartItem.getQuantity());
								orderItem.setUnitPrice(product.getPrice());
								orderItem.setTotalPrice(product.getPrice().multiply(BigDecimal.valueOf(cartItem.getQuantity())));
								return orderItem;

	}
}

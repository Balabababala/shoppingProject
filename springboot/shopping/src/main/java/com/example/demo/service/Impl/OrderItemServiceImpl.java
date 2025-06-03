package com.example.demo.service.Impl;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
	
	//repository
	

	@Override
	public void save(OrderItem orderItem) {
		orderItemRepository.save(orderItem);
	}
	
	//邏輯
	
	@Override
	public void addOrderItem(List<OrderItem> orderItems) {
		for(OrderItem orderItem:orderItems) {
			save(orderItem);
		}		
	}

	@Override
	public OrderItem cartItemToOrderItem(CartItem cartItem) {
								Product product=cartItem.getProduct();
								OrderItem orderItem =new OrderItem();
								
								orderItem.setProduct(product);
								orderItem.setQuantity(cartItem.getQuantity());
								orderItem.setUnitPrice(product.getPrice());
								orderItem.setTotalPrice(product.getPrice().multiply(BigDecimal.valueOf(cartItem.getQuantity())));
								return orderItem;

	}
}

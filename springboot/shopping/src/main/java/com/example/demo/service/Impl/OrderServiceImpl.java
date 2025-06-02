package com.example.demo.service.Impl;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import org.springframework.beans.factory.annotation.Autowired;

import com.example.demo.mapper.OrderMapper;
import com.example.demo.model.dto.OrderRequest;
import com.example.demo.model.entity.CartItem;
import com.example.demo.model.entity.Order;
import com.example.demo.model.entity.OrderItem;
import com.example.demo.model.entity.User;
import com.example.demo.repository.OrderItemRepository;
import com.example.demo.repository.OrderRepository;
import com.example.demo.service.CartItemService;
import com.example.demo.service.OrderItemService;
import com.example.demo.service.OrderService;
import com.example.demo.service.ProductService;
import com.example.demo.service.UserService;

public class OrderServiceImpl implements OrderService{

	@Autowired
	private OrderRepository orderRepository; 
	
	@Autowired
	private OrderItemService orderItemService;
	
	@Autowired
	private CartItemService cartItemService;
	
	@Autowired
	private UserService userService;
	
	@Autowired
	private ProductService productService;
	
	//repository
	@Override
	public void save(Order order) {
		orderRepository.save(order);
	}
	
	//邏輯
	
	@Override
	public void createOrder(OrderRequest orderRequest,Long BuyerId) {
		User Buyer=userService.findUserById(BuyerId); //因為建定單要用 (我已用join colunm  BuyerId的新增 更新不能用 )
		//先 生出 Map<Long,List<OrderItem>> for 依SellerId 分的 orderItems (依賣家 建1個order和 多個對應的orderitems -product 對應的產品)
		//注意 cartItemService.orderItemsGroupedBySeller 這是 取userId 的 cartItems 轉成依 SellerId分的 orderItems!!  要注意它不是完整的orderItem 
		for(Entry<Long, List<OrderItem>> sellerAndOrderItem:cartItemService.orderItemsGroupedBySeller(BuyerId).entrySet()) {
			
			//取等下要用的資料
			Long SellerId = sellerAndOrderItem.getKey();
			User Seller =userService.findUserById(SellerId);
			List<OrderItem> orderItems =sellerAndOrderItem.getValue();
			
			//暫時計入金錢的
			BigDecimal total = orderItems.stream()
				    .map(OrderItem::getTotalPrice)
				    .reduce(BigDecimal.ZERO, BigDecimal::add);
			
			//order的部分
			Order order=OrderMapper.toEntity(orderRequest, Buyer, Seller, total);
			save(order);
			
			//orderItems的部分
			Long orderId=order.getId();
			for (OrderItem orderItem : orderItems) {
				productService.minusProductByid(orderItem.getProductId(), orderItem.getQuantity());
				orderItem.setOrderId(orderId);
				orderItemService.save(orderItem);    
			}		
		};
	}

	
	
}

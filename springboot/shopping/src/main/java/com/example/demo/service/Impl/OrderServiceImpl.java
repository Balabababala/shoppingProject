package com.example.demo.service.Impl;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.exception.ShoppingException;
import com.example.demo.mapper.CreateOrderMapper;
import com.example.demo.mapper.OrderMapper;
import com.example.demo.model.dto.CreateOrderDto;
import com.example.demo.model.dto.OrderResponse;
import com.example.demo.model.dto.UserDto;
import com.example.demo.model.entity.CartItem;
import com.example.demo.model.entity.Order;
import com.example.demo.model.entity.OrderItem;
import com.example.demo.model.entity.User;
import com.example.demo.model.enums.OrderStatus;
import com.example.demo.model.enums.PaymentStatus;
import com.example.demo.model.enums.ShipmentStatus;
import com.example.demo.repository.OrderItemRepository;
import com.example.demo.repository.OrderRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.response.ApiResponse;
import com.example.demo.service.CartItemService;
import com.example.demo.service.OrderItemService;
import com.example.demo.service.OrderService;
import com.example.demo.service.ProductService;
import com.example.demo.service.UserService;

@Service
public class OrderServiceImpl implements OrderService{

	@Autowired
	private OrderRepository orderRepository; 
	
	@Autowired
	private UserRepository userRepository;
	
	@Autowired
	private OrderItemRepository orderItemRepository;
	
	@Autowired
	private CartItemService cartItemService;
	
	@Autowired
	private ProductService productService;
	

	
	//邏輯
	


	

	@Transactional
	@Override
	public void createOrder(CreateOrderDto orderRequest,Long BuyerId) {
		User Buyer=userRepository.findById(BuyerId).orElseThrow(()-> new ShoppingException("找不到買家")); //因為建定單要用 (我已用join colunm  BuyerId的新增 更新不能用 )
		//先 生出 Map<Long,List<OrderItem>> for 依SellerId 分的 orderItems (依賣家 建1個order和 多個對應的orderitems -product 對應的產品)
		//注意 cartItemService.orderItemsGroupedBySeller 這是 取userId 的 cartItems 轉成依 SellerId分的 orderItems!!  要注意它不是完整的orderItem 
		for(Entry<Long, List<OrderItem>> sellerAndOrderItem:cartItemService.orderItemsGroupedBySeller(BuyerId).entrySet()) {
			
			//取等下要用的資料
			Long SellerId = sellerAndOrderItem.getKey();
			User Seller =userRepository.findById(SellerId).orElseThrow(()-> new ShoppingException("找不到賣家"));
			List<OrderItem> orderItems =sellerAndOrderItem.getValue();
			
			//暫時計入金錢的
			BigDecimal total = orderItems.stream()
				    .map(OrderItem::getTotalPrice)
				    .reduce(BigDecimal.ZERO, BigDecimal::add);
			
			//order的部分
			Order order=CreateOrderMapper.toEntity(orderRequest, Buyer, Seller, total);
			orderRepository.save(order);
			
			//orderItems的部分

			for (OrderItem orderItem : orderItems) {
				productService.minusProductByid(orderItem.getProduct().getId(), orderItem.getQuantity());
				orderItem.setOrder(order);
				orderItemRepository.save(orderItem);    
			}		
		}
		//清購物車
		cartItemService.clearCart(BuyerId);
	}

	@Override
	public CreateOrderDto getUserDefaultToCreateOrderDto(UserDto userDto) {
		CreateOrderDto createorderDto = new CreateOrderDto();
		createorderDto.setReceiverName(userRepository.findByUsername(userDto.getUsername()).get().getDefaultReceiverName());
		createorderDto.setShippingAddress(userRepository.findByUsername(userDto.getUsername()).get().getDefaultAddress());
		createorderDto.setReceiverPhone(userRepository.findByUsername(userDto.getUsername()).get().getDefaultReceiverPhone());
			
		return createorderDto;
	}

	@Override
	public List<OrderResponse> getOrderByBuyerId(Long userId) {
		return orderRepository.findByBuyerIdWithOrderItemAndBuyerAndSeller(userId).stream()
																  .map(OrderMapper::toDto)
																  .toList();
	}

	private boolean isCancellable(Order order) {
	    return (order.getOrderStatus() == OrderStatus.PENDING || order.getOrderStatus() == OrderStatus.PAID)
	           && order.getShipmentStatus() == ShipmentStatus.NOT_SHIPPED;
	}
	
	
	
	@Override
	@Transactional
	public void cancelOrder(Long orderId, Long buyerId) {
	    Order order = orderRepository.findById(orderId)
	        .orElseThrow(() -> new ShoppingException("訂單不存在"));

	    if (!order.getBuyer().getId().equals(buyerId)) {
	        throw new ShoppingException("無權限取消此訂單");
	    }

	    if (!isCancellable(order)) {
	        throw new IllegalStateException("該訂單無法取消");
	    }

	    order.setOrderStatus(OrderStatus.CANCELLED);
	    order.setPaymentStatus(PaymentStatus.REFUNDED); // 如果未付款可保留為 PENDING

	    orderRepository.save(order);

	    // TODO: 如有付款，進行退款流程（例如呼叫支付 API）
	    // TODO: 發送通知（待補）
	}


	@Override
	public List<OrderResponse> getOrderBySellerId(Long userId) {
		return orderRepository.findBySellerIdWithOrderItemAndBuyerAndSeller(userId).stream()
																   .map(OrderMapper::toDto)
																   .toList();
	}

	
	
}

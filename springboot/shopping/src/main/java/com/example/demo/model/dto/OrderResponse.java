package com.example.demo.model.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderResponse {
	
	private Long id;                      // 訂單 ID
	private Long buyerId;
	private Long sellerId;
	    
	private LocalDateTime orderDate;
	    
	private String orderStatus;
	private String paymentStatus;
	private String shipmentStatus;
	    
	private String shippingMethod;
	private String paymentMethod;
	    
	private String trackingNumber;
	    
	private String receiverName;
	private String receiverPhone;
	private String shippingAddress;
	    
	private BigDecimal totalAmount;
	    
	private String notes;
	    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // ⭐ 訂單明細
    private List<OrderItemResponse> items;
}

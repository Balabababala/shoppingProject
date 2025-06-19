package com.example.demo.model.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AdminOrderEditDto {
    private Long id;
    private String orderNumber;

    private Long buyerId;
    private String buyerName;

    private Long sellerId;
    private String sellerName;

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
}

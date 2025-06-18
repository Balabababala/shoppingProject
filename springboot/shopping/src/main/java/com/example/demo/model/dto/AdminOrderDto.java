package com.example.demo.model.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AdminOrderDto {
    private Long id;
    private String orderNumber;
    private String buyerName;      // 明確是買家名稱
    private String sellerName;     // 加上賣家名稱
    private LocalDateTime orderDate;
    private String orderStatus;    // 用更完整的命名
    private BigDecimal totalAmount;
}


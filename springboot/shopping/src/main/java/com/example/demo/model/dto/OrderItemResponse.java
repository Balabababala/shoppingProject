package com.example.demo.model.dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderItemResponse {
	 	private Long productId;        // 商品 ID
	    private String productName;    // 商品名稱
	    private Integer quantity;      // 數量
	    private BigDecimal unitPrice;  // 單價
	    private BigDecimal subtotal;   // 小計（單價 * 數量）
}

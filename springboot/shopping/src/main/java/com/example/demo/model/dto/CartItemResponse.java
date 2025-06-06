package com.example.demo.model.dto;


import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

//後端傳前端用
@AllArgsConstructor
@NoArgsConstructor
@Data
public class CartItemResponse {		   
	private Long productId;           
	private String productName;
	private String imageUrl;
	private BigDecimal price;
	private Integer quantity;
}

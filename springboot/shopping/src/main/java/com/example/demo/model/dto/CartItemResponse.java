package com.example.demo.model.dto;


import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;

//後端傳前端用
@AllArgsConstructor
@Data
public class CartItemResponse {	//要加圖片 價格
	private Long id;           // 新增商品id欄位
	private String ProductName;
	private String imageUrl;
	private BigDecimal price;
	private Integer Quantity;
}

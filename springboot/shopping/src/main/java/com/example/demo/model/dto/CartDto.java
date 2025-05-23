package com.example.demo.model.dto;


import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;


@AllArgsConstructor
@Data
public class CartDto {	//要加圖片 價格
	private String ProductName;
	private String imageUrl;
	private BigDecimal price;
	private Integer Quantity;
}

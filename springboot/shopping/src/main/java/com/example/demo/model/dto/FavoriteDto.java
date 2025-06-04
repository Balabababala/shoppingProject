package com.example.demo.model.dto;

import java.math.BigDecimal;

import com.example.demo.model.enums.ProductStatus;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FavoriteDto {
	private Long productId;
	private String productName;
	private BigDecimal price;
	private String imageUrl;
	private String categoryName;
	private ProductStatus isAvailable;
}

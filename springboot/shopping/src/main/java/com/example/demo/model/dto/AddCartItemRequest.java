package com.example.demo.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;


@AllArgsConstructor
@Data
public class AddCartItemRequest {
	private Long userId;
	private Long productId;
	private Integer quantity;
}

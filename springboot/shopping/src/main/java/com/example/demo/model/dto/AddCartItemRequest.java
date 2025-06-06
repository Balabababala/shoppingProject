package com.example.demo.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@AllArgsConstructor
@NoArgsConstructor
@Data
public class AddCartItemRequest {
	private Long userId;
	private Long productId;
	private Integer quantity;
}

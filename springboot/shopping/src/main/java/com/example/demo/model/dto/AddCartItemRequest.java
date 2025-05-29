package com.example.demo.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;


@AllArgsConstructor
@Data
public class AddCartItemRequest {
	Long userId;
	Long productId;
	Integer quantity;
}

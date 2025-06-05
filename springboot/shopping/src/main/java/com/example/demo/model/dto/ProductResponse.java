package com.example.demo.model.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import com.example.demo.model.entity.User;

import lombok.AllArgsConstructor;
import lombok.Data;

//後端傳前端用
@Data
@AllArgsConstructor
public class ProductResponse {
	
    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private Integer stock;
    private Long categoryId;
    private String categoryName;
    private UserDto sellerUserDto;
    private List<ProductImageResponse> productImageResponse;
}

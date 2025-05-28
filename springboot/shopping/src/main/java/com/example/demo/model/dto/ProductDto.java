package com.example.demo.model.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.example.demo.model.entity.User;

import lombok.AllArgsConstructor;
import lombok.Data;


@Data
@AllArgsConstructor
public class ProductDto {
	
    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private Integer stock;
    private String imageUrl;
    private Long categoryId;
    private UserDto sellerUserDto;
}

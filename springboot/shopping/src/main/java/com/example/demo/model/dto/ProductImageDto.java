package com.example.demo.model.dto;

import lombok.Data;

@Data
public class ProductImageDto {
    private Long id;         // 圖片ID
    private Long productId;  // 所屬商品ID
    private String imageUrl; // 圖片網址
    private Integer number;  // 圖片順序 1~10
}

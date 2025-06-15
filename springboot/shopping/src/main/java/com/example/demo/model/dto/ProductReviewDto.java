package com.example.demo.model.dto;


import lombok.AllArgsConstructor;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductReviewDto {

    private Long id;
    private Long userId;
    private String username; // 顯示用戶名稱（可選）
    private Long productId;
    private Integer rating;
    private String comment;
    private Boolean isVisible;
    private Boolean isApproved;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
}

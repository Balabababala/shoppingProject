package com.example.demo.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductReviewCreateRequest {
    private Long userId;
    private Long productId;
    private Integer rating;
    private String comment;
}

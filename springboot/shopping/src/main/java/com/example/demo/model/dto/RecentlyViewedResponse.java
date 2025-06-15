package com.example.demo.model.dto;

import java.time.LocalDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RecentlyViewedResponse {

    private Long productId;
    private String productName;
    private List<ProductImageDto> productImageDtos;
    private LocalDateTime viewedAt;

}

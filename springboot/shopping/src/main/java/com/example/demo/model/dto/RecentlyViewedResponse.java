package com.example.demo.model.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RecentlyViewedResponse {

    private Long productId;
    private String productName;
    private String productImage;
    private LocalDateTime viewedAt;

}

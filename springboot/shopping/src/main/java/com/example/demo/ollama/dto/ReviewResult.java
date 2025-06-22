package com.example.demo.ollama.dto;

import lombok.Data;

@Data
public class ReviewResult {
    private Long id;
    private String comment;
    private Integer rating;
    private String status;
    private String reason;
    private String sentiment;
    private Long userId;
    private Long productId;
    private Boolean isVisible;
    private Boolean isApproved;
    private Boolean approvedByAi;
}
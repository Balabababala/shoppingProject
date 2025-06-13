package com.example.demo.model.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.lang.Nullable;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.model.enums.ProductStatus;

@Data
public class SellerProductCreateRequest {

    @NotBlank
    private String name;

    private String description;

    @NotNull
    @DecimalMin(value = "0.0", inclusive = false)
    private BigDecimal price;

    @NotNull
    @Min(1)
    private Integer stock;

    @NotNull
    private ProductStatus status; // ACTIVE, INACTIVE

    @NotNull
    private Long categoryId;
    
    @Nullable
    private MultipartFile thumbnail; // 主圖
    
    @Nullable
    private List<MultipartFile> extraImages; // 其他圖
}

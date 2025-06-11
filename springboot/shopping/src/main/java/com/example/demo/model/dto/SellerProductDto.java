package com.example.demo.model.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

import com.example.demo.model.enums.ProductStatus;

@Data
public class SellerProductDto {

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
    private ProductStatus status; // ACTIVE,INACTIVE

    @NotNull
    private Long categoryId;


    private String imageUrl; 
}

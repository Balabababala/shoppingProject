package com.example.demo.model.dto;

import java.math.BigDecimal;
import java.util.List;



import com.example.demo.model.enums.ProductStatus;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SellerProductResponse {

	private Long id;
    private String name;
    private String description;
    @DecimalMin(value = "0.0", inclusive = false)
    private BigDecimal price;
    @Min(1)
    private Integer stock;
    private Boolean isDeleted;	
    private ProductStatus status; // ACTIVE, INACTIVE
    private Long categoryId;
    private List<ProductImageDto> ProductImageDto;
}

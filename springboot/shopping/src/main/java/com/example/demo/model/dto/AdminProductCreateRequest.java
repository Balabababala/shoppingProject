package com.example.demo.model.dto;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.lang.Nullable;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.model.enums.ProductStatus;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminProductCreateRequest {

	@NotBlank
    private String name;

    private String description;

    @NotNull
    private Long sellerId;  // 新增賣家ID欄位，必填
    
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

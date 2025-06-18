package com.example.demo.model.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class RecommendedProductDto {
    private Long id;

    private Long userId;
    private String username;

    @NotNull(message = "產品 ID 不能為空")
    private Long productId;
    private String productName;

    @NotNull(message = "規則 ID 不能為空")
    private Long ruleId;
    private String ruleName;

    @Size(max = 255, message = "推薦原因不得超過 255 個字符")
    private String reason;

    @NotNull(message = "推薦分數不能為空")
    @Min(value = 0, message = "推薦分數必須大於或等於 0")
    @Max(value = 1, message = "推薦分數必須小於或等於 1")
    private Double score;

    @NotNull(message = "啟用狀態不能為空")
    private Boolean active;
}
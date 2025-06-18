package com.example.demo.model.dto;


import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class RecommendRuleDto {
    private Long id;

    @NotBlank(message = "規則名稱不能為空")
    private String name;

    @NotBlank(message = "規則類型不能為空")
    private String type;

    @NotNull(message = "權重不能為空")
    @Min(value = 0, message = "權重必須大於或等於 0")
    @Max(value = 1, message = "權重必須小於或等於 1")
    private Double weight;

    @NotNull(message = "啟用狀態不能為空")
    private Boolean active;

   
}
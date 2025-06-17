package com.example.demo.model.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminCategoryDto {

    private Long id;  // 修改時會用到，新增時可不傳或為 null

    @NotBlank(message = "分類名稱不得為空")
    @Size(max = 100, message = "分類名稱長度不得超過100字")
    private String name;

    
    // 可為 null，代表頂層分類
    private Long parentId;
    
    private String parentName;

    @NotBlank(message = "slug 不得為空")
    @Size(max = 100, message = "slug 長度不得超過100字")
    private String slug;
}

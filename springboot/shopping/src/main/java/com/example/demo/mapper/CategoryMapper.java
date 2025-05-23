package com.example.demo.mapper;

import java.util.List;

import com.example.demo.model.dto.CategoryDto;
import com.example.demo.model.entity.Category;

public class CategoryMapper {
    public static CategoryDto toDto(Category category) {
        return new CategoryDto(
            category.getId(),
            category.getName(),
            category.getParentId(),
            category.getSlug(),
            List.of() // 預設為空清單，之後手動設定
        );
    }
}

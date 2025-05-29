package com.example.demo.mapper;

import com.example.demo.model.dto.CategoryResponse;
import com.example.demo.model.entity.Category;

public class CategoryMapper {
    public static CategoryResponse toDto(Category category) {
        return new CategoryResponse(
            category.getId(),
            category.getName(),
            category.getParentId(),
            category.getSlug(),
            category.getChildren().stream()
            					  .map(CategoryMapper::toDto)
            					  .toList()
        );
    }
}

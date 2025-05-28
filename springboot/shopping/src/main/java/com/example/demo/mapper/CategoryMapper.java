package com.example.demo.mapper;

import com.example.demo.model.dto.CategoryDto;
import com.example.demo.model.entity.Category;

public class CategoryMapper {
    public static CategoryDto toDto(Category category) {
        return new CategoryDto(
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

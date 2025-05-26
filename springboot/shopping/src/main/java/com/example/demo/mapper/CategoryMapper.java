package com.example.demo.mapper;

import java.util.ArrayList;
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
            new ArrayList<>()
        );
    }
}

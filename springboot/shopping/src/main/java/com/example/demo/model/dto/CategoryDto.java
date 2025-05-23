package com.example.demo.model.dto;


import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;


@Data
@AllArgsConstructor
public class CategoryDto {
    private Long id;
    private String name;
    private Long parentId;
    private String slug;
    private List<CategoryDto> children;
}

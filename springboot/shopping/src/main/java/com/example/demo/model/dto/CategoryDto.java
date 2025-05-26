package com.example.demo.model.dto;


import java.util.ArrayList;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class CategoryDto {
    private Long id;
    private String name;
    private Long parentId;
    private String slug;
    private List<CategoryDto> children= new ArrayList<>();
}

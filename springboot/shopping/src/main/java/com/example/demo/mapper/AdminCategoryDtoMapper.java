package com.example.demo.mapper;


import com.example.demo.model.dto.AdminCategoryDto;
import com.example.demo.model.entity.Category;

public class AdminCategoryDtoMapper {

    // DTO -> Entity
	public static Category toEntity(AdminCategoryDto adminCategoryDto) {
	    if (adminCategoryDto == null) {
	        return null;
	    }
	    Category category = new Category();
	    category.setId(adminCategoryDto.getId());
	    category.setName(adminCategoryDto.getName());
	    category.setSlug(adminCategoryDto.getSlug());

	    if (adminCategoryDto.getParentId() != null) {
	        Category parent = new Category();
	        parent.setId(adminCategoryDto.getParentId());
	        category.setParent(parent);
	        category.setParentId(adminCategoryDto.getParentId());
	    } else {
	        category.setParent(null);
	        category.setParentId(null);
	    }

	    return category;
	}

    // Entity -> DTO
    public static AdminCategoryDto toDto(Category entity) {
        if (entity == null) {
            return null;
        }
        AdminCategoryDto dto = new AdminCategoryDto();
        dto.setId(entity.getId());
        dto.setName(entity.getName());
        dto.setSlug(entity.getSlug());

        if (entity.getParent() != null) {
            dto.setParentId(entity.getParent().getId());
            dto.setParentName(entity.getParent().getName()); // 額外加入
        } else {
            dto.setParentId(null);
            dto.setParentName(null);
        }

        return dto;
    }
}

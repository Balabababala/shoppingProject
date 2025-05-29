package com.example.demo.util;

import java.util.HashMap;
import java.util.List;
import java.util.Map;



import com.example.demo.mapper.CategoryMapper;
import com.example.demo.model.dto.CategoryResponse;
import com.example.demo.model.entity.Category;


public class CategoryTreeUtil {

	
	
	
	static public Map<Long,CategoryResponse> buildCategoryMap(List<Category> categories) {
		Map <Long,CategoryResponse> categoryDtoMap=new HashMap<>();
	    for(Category category:categories) {
	    	categoryDtoMap.put(category.getId(),CategoryMapper.toDto(category));
	    }
		return categoryDtoMap;
	}
	
	
}

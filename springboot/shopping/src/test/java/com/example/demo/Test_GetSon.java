package com.example.demo;

import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.example.demo.mapper.CategoryMapper;
import com.example.demo.model.dto.CategoryDto;
import com.example.demo.model.entity.Category;
import com.example.demo.repository.CategoryRepository;
import com.example.demo.util.CategoryTreeUtil;

@SpringBootTest
public class Test_GetSon {

	@Autowired
	private CategoryRepository categoryRepository;
	
	private CategoryDto findCategoryBySlug(String slug){
		Category category = categoryRepository.findBySlug(slug)
		        .orElseThrow(() -> new RuntimeException("找不到分類 " + slug));
		return CategoryMapper.toDto(category);
	}
	
	
	
	@Test
	public void son() {
		Map<Long,CategoryDto> categoryDtos  = CategoryTreeUtil.buildCategoryMap(categoryRepository.findAll());
		
		// 2. 建立樹狀結構
		for(CategoryDto categoryDto: categoryDtos.values()) {
			Long pid = categoryDto.getParentId();
			if (pid != null && categoryDtos.containsKey(pid)) {
				categoryDtos.get(pid).getChildren().add(categoryDto); // 把自己加到父節點的 children
	        }
		}
		
		 // 3. 回傳指定 slug 下的子樹根節點（例如首頁點開的某大分類）
	    System.out.printf(findCategoryBySlug("clothing").getChildren().toString()) ;
	}
}

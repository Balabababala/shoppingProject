package com.example.demo.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.demo.model.dto.ProductDto;



public interface ProductService {
	ProductDto findById(Long id);
	List<ProductDto> findAll();
	List<ProductDto> findCategoryById(Long categoryId);
	List<ProductDto> findCategoryBySlug(String slug);
	List<ProductDto> findAllCategoryBySlug(String slug);
	List<ProductDto> findByKeyword(String keyword); 
	List<ProductDto> findByKeywordFullTextBoolean(String keyword);//test
}

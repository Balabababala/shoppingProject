package com.example.demo.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.demo.model.dto.ProductResponse;



public interface ProductService {
	ProductResponse findById(Long id);
	List<ProductResponse> findAll();
	List<ProductResponse> findCategoryById(Long categoryId);
	List<ProductResponse> findCategoryBySlug(String slug);
	List<ProductResponse> findAllCategoryBySlug(String slug);
	List<ProductResponse> findByKeyword(String keyword); 
	List<ProductResponse> findByKeywordFullTextBoolean(String keyword);//test
}

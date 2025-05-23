package com.example.demo.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.demo.model.dto.ProductDto;



public interface ProductService {
	List<ProductDto> findByCategoryId(Long categoryId);
	List<ProductDto> findByCategorySlug(String slug);
}

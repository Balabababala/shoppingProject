package com.example.demo.service.Impl;

import java.util.List;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.model.dto.ProductDto;
import com.example.demo.repository.CategoryRepository;
import com.example.demo.repository.ProductRepository;
import com.example.demo.service.ProductService;
import com.example.demo.mapper.*;

@Service
public class ProductServiceImpl implements ProductService{

	@Autowired
	ProductRepository productRepository;
	@Autowired
	CategoryRepository categoryRepository;
	
	@Override
	public List<ProductDto> findAll() {
		 return categoryRepository.findAll().stream()
		        .flatMap(category -> 
	            productRepository.findByCategoryId(category.getId()).stream()
	                .map(ProductMapper::toDto)
	        )
	        .toList();
	}
	
	@Override
	public List<ProductDto> findByCategoryId(Long categoryId) {
		productRepository.findByCategoryId(categoryId);
		return productRepository.findByCategoryId(categoryId).stream()
															 .map(ProductMapper::toDto)
															 .toList();
	}
	
	
	@Override
	public List<ProductDto> findByCategorySlug(String slug) {
		 return categoryRepository.findBySlug(slug).stream()
		        .flatMap(category -> 
	            productRepository.findByCategoryId(category.getId()).stream()
	                .map(ProductMapper::toDto)
	        )
	        .toList();
	}

	
	@Override 
	public List<ProductDto> findByKeyword(String keyword) {
		return productRepository.findByKeywordFullText(keyword).stream()
																.map(ProductMapper::toDto)
																.toList();
	}
	
	@Override 
	public List<ProductDto> findByKeywordFullTextBoolean(String keyword) {
		return productRepository.findByKeywordFullTextBoolean(keyword).stream()
																.map(ProductMapper::toDto)
																.toList();
	}
	
	
}

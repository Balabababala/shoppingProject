package com.example.demo.service.Impl;

import java.util.List;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.model.dto.ProductDto;
import com.example.demo.repository.CategoryRepository;
import com.example.demo.repository.ProductRepository;
import com.example.demo.service.CategoryService;
import com.example.demo.service.ProductService;
import com.example.demo.mapper.*;

@Service
public class ProductServiceImpl implements ProductService{

	@Autowired
	ProductRepository productRepository;

	@Autowired
	CategoryRepository categoryRepository;
	
	@Autowired
	CategoryService categoryService;
	
	@Override
	public ProductDto findById(Long id) {
		return ProductMapper.toDto(productRepository.findById(id).get());
	}
	
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
	public List<ProductDto> findCategoryById(Long categoryId) {
		productRepository.findByCategoryId(categoryId);
		return productRepository.findByCategoryId(categoryId).stream()
															 .map(ProductMapper::toDto)
															 .toList();
	}
	
	
	@Override
	public List<ProductDto> findCategoryBySlug(String slug) {		//自己
		 return categoryRepository.findBySlug(slug).stream()
		        .flatMap(category -> 
	            productRepository.findByCategoryId(category.getId()).stream()
	                .map(ProductMapper::toDto)
	        )
	        .toList();
	}
	
	@Transactional
	@Override
	public List<ProductDto> findAllCategoryBySlug(String slug) {  	//自己+子子孫孫
		 return categoryService.findAllCategoryAndDescendantsBySlug(slug).stream()
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

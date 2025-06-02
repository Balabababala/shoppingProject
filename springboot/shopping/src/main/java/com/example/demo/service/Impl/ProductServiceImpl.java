package com.example.demo.service.Impl;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.model.dto.ProductResponse;
import com.example.demo.model.entity.Product;
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
	
	//repository
	
	public void minusById(Long id, int quantity) {
		productRepository.minusById	(id,quantity);
	}


	public Optional<Product> findById(Long id) {
		return productRepository.findById(id);
	}


	public List<Product> findByCategoryId(Long categoryId) {
		return productRepository.findByCategoryId(categoryId);
	}


	public List<Product> findByKeywordFullTextBoolean(String keyword) {
		return productRepository.findByKeywordFullTextBoolean(keyword);
	}

	//邏輯
	

	@Override
	public void minusProductByid(Long id, Integer quantity) {
		minusById(id, quantity);
	}
	
	@Override
	public ProductResponse findByIdToProductResponse(Long id) {
		return ProductMapper.toDto(productRepository.findById(id).get());
	}
	
	@Override
	public List<ProductResponse> findAll() {
		 return categoryRepository.findAll().stream()
		        .flatMap(category -> 
	            productRepository.findByCategoryId(category.getId()).stream()
	                .map(ProductMapper::toDto)
	        )
	        .toList();
	}
	
	
	@Transactional
	@Override
	public List<ProductResponse> findAllCategoryBySlug(String slug) {  	//自己+子子孫孫
		 return categoryService.findAllCategoryAndDescendantsBySlug(slug).stream()
		        .flatMap(category -> 
	            productRepository.findByCategoryId(category.getId()).stream()
	                								.map(ProductMapper::toDto)
	        )
	        .toList();
	}

	
//	@Override 
//	public List<ProductResponse> findByKeyword(String keyword) {
//		
//		System.out.print(keyword);
//		return productRepository.findByKeywordFullText(keyword).stream()
//																.map(ProductMapper::toDto)
//																.toList();
//	}
	
	@Override 
	public List<ProductResponse> findByKeywordFullTextBooleanToProductResponses(String keyword) {//boolean 狀態才能 用*萬用字元
		keyword=keyword+'*';
		return productRepository.findByKeywordFullTextBoolean(keyword).stream()
																.map(ProductMapper::toDto)
																.toList();
	}
	
}

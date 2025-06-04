package com.example.demo.service.Impl;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.model.dto.ProductResponse;
import com.example.demo.model.entity.Product;
import com.example.demo.repository.CategoryRepository;
import com.example.demo.repository.ProductRepository;
import com.example.demo.service.CategoryService;
import com.example.demo.service.ProductService;
import com.example.demo.exception.ShoppingException;
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


	@CacheEvict(value = "products", key = "#id")
	@Override	
	public Long minusByIdIfEnoughStock(Long id, Integer quantity) {
		return productRepository.minusByIdIfEnoughStock(id, quantity);
	}
	

	@Cacheable(value = "products", key = "#id")
	@Override
	public Optional<Product> findProductById(Long id) {
		return productRepository.findById(id);
	}


	@Override
	public List<Product> findByCategoryId(Long categoryId) {
		return productRepository.findByCategoryId(categoryId);
	}


	@Override
	public List<Product> findByKeywordFullTextBoolean(String keyword) {
		return productRepository.findByKeywordFullTextBoolean(keyword);
	}

	//邏輯

	@Override
	public void minusProductByid(Long id, Integer quantity) {
		Long updatedRows=minusByIdIfEnoughStock(id, quantity);
		if (updatedRows == 0) {
	        throw new ShoppingException("庫存不足，無法扣除商品庫存，商品ID：" + id);
	    }
	}
	
	@Override
	public ProductResponse findByIdToProductResponse(Long id) {
		return ProductMapper.toDto(productRepository.findById(id).get());
	}
	
	@Override
	public List<ProductResponse> findAllProductsToProductResponse() {
		 return categoryRepository.findAll().stream()
		        .flatMap(category -> 
	            productRepository.findByCategoryId(category.getId()).stream()
	                .map(ProductMapper::toDto)
	        )
	        .toList();
	}
	
	

	@Override
	public List<ProductResponse> findAllProductsByCategorySlugToProductResponses(String slug) {  	//自己+子子孫孫
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
	public List<ProductResponse> findProductsByKeywordFullTextBooleanToProductResponses(String keyword) {//boolean 狀態才能 用*萬用字元
		keyword=keyword+'*';
		return productRepository.findByKeywordFullTextBoolean(keyword).stream()
																.map(ProductMapper::toDto)
																.toList();
	}
	
}

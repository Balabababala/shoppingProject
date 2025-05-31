package com.example.demo.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.demo.model.dto.ProductResponse;



public interface ProductService {
	
	
	void minusProductByid(Long id ,Integer quantity);			//依 productId -quantity
	ProductResponse findById(Long id);							//依 productId 找 產品轉DTO  產品卡用
	List<ProductResponse> findAll();							//找全部			 產品轉DTO
	List<ProductResponse> findAllCategoryBySlug(String slug);	//依 slug(分類別稱)找分類(含子分類)下的所有產品 轉DTO
//	List<ProductResponse> findByKeyword(String keyword); 
	List<ProductResponse> findByKeywordFullTextBoolean(String keyword);//全文搜尋版 找相關產品轉DTO
}

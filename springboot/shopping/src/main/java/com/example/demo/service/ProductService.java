package com.example.demo.service;

import java.util.List;
import java.util.Optional;

import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Service;

import com.example.demo.model.dto.ProductResponse;
import com.example.demo.model.entity.Product;



public interface ProductService {
	//repository
	void minusById(Long id,int quantity);
	Optional<Product> findById(Long id);
	List<Product> findByCategoryId(Long categoryId);
	List<Product> findByKeywordFullTextBoolean(String keyword);
	
	
	//邏輯
	void minusProductByid(Long id ,Integer quantity);			//依 productId -quantity  要判斷庫存(還沒寫)
	ProductResponse findByIdToProductResponse(Long id);			//依 productId 找 產品轉DTO  產品卡用
	List<ProductResponse> findAll();							//找全部			 產品轉DTO
	List<ProductResponse> findAllCategoryBySlug(String slug);	//依 slug(分類別稱)找分類(含子分類)下的所有產品 轉DTO
//	List<ProductResponse> findByKeyword(String keyword); 	 	
	List<ProductResponse> findByKeywordFullTextBooleanToProductResponses(String keyword);//全文搜尋版 找相關產品轉DTO
}

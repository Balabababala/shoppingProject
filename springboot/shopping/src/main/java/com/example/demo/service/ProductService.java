package com.example.demo.service;

import java.util.List;
import java.util.Optional;

import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Service;

import com.example.demo.model.dto.ProductResponse;
import com.example.demo.model.entity.Product;



public interface ProductService {
	//repository
	
	List<Product> findAllProductsWithCategory();
	Optional<Product> findByIdWithCategoryAndProductImage(Long id);
	List<Product> findAllByCategoryIdsWithCategoryAndProductImage(List<Long> categoryIds);
	Integer minusByIdIfEnoughStock(Long id, Integer quantity);
	Optional<Product> findById(Long id);
	List<Product> findByCategoryId(Long categoryId);
	List<Product> findByKeywordFullTextBoolean(String keyword);
	
	//邏輯
	
	void minusProductByid(Long id ,Integer integer);									//依 productId -quantity  要判斷庫存(還沒寫)
	ProductResponse findProductByIdToProductResponse(Long id);									//依 productId 找 產品轉DTO  				  產品卡用
	List<ProductResponse> findAllProductsToProductResponse();							//找全部			 產品轉DTO  				  分類頁面用
	List<ProductResponse> findAllProductsByCategorySlugToProductResponses(String slug);	//依 slug(分類別稱)找分類(含子分類)下的所有產品 轉DTO  分類頁面用     
//	List<ProductResponse> findByKeyword(String keyword); 	 	
	List<ProductResponse> findProductsByKeywordFullTextBooleanToProductResponses(String keyword);//全文搜尋版 找相關產品轉DTO			  收尋頁面用
}

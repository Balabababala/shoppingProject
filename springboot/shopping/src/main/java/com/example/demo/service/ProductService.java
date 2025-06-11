package com.example.demo.service;

import java.util.List;
import java.util.Optional;

import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Service;

import com.example.demo.model.dto.ProductResponse;
import com.example.demo.model.dto.SellerProductDto;
import com.example.demo.model.entity.Product;

import jakarta.servlet.http.HttpSession;



public interface ProductService {
	//repository
	void save(Product product);
	Integer minusByIdIfEnoughStock(Long id, Integer quantity);
	List<Product> findBySellerIdWithSellerAndCategoryAndProductImage(Long sellerId);
	Optional<Product> findBySellerIdAndProductIdWithSellerAndCategoryAndProductImage(Long sellerId, Long productId);
	List<Product> findAllProductsWithCategory();
	Optional<Product> findByIdWithCategoryAndProductImage(Long id);
	List<Product> findAllByCategoryIdsWithCategoryAndProductImage(List<Long> categoryIds);
	Optional<Product> findById(Long id);
	List<Product> findByCategoryId(Long categoryId);
	List<Product> findByKeywordFullTextBoolean(String keyword);
	
	//邏輯
	
	void addProduct(SellerProductDto sellerProductDto,HttpSession session);								//新增 產品 
	void updataProduct(SellerProductDto sellerProductDto ,Long productId,HttpSession session);			//更新 產品
	void deleteProduct(Long productId,HttpSession session);												//更新 產品 改成刪除狀態 (查資料庫同時 也驗證了身分)
	void unActiveProduct(Long productId,HttpSession session);											//更新 產品 改成下架狀態 (查資料庫同時 也驗證了身分)
	void activeProduct(Long productId,HttpSession session);												//更新 產品 改成上架狀態 (查資料庫同時 也驗證了身分)
	SellerProductDto findProductByIdToSellerProductDto(Long productId,HttpSession session);				//依 productId 找 產品轉SellerProductDto	  更新 產品用 (查資料庫同時 也驗證了身分 其實不用 但我想共用一樣的方法)
	void minusProductByid(Long id ,Integer integer);													//依 productId -quantity 
	ProductResponse findProductByIdToProductResponse(Long id);											//依 productId 找 產品轉DTO  				  產品卡用
	List<ProductResponse> findAllProductsToProductResponse();											//找全部			 產品轉DTO  				  分類頁面用
	List<ProductResponse> findAllProductsByCategorySlugToProductResponses(String slug);					//依 slug(分類別稱)找分類(含子分類)下的所有產品 轉DTO  分類頁面用     
//	List<ProductResponse> findByKeyword(String keyword); 	 	
	List<ProductResponse> findProductsByKeywordFullTextBooleanToProductResponses(String keyword);		//全文搜尋版 找相關產品轉DTO			  收尋頁面用
	
	
}

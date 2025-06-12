package com.example.demo.service;

import java.util.List;
import java.util.Optional;

import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Service;

import com.example.demo.model.dto.ProductResponse;
import com.example.demo.model.dto.SellerProductCreateRequest;
import com.example.demo.model.dto.SellerProductResponse;
import com.example.demo.model.entity.Product;

import jakarta.servlet.http.HttpSession;



public interface ProductService {
	
	
	//邏輯
	
	void addProduct(SellerProductCreateRequest sellerProductDto,HttpSession session);								//新增 產品 
	void updateProduct(SellerProductCreateRequest sellerProductDto ,Long productId,HttpSession session);			//更新 產品
	void deleteProduct(Long productId,HttpSession session);												//更新 產品 改成刪除狀態 (查資料庫同時 也驗證了身分)
	void unActiveProduct(Long productId,HttpSession session);											//更新 產品 改成下架狀態 (查資料庫同時 也驗證了身分)
	void activeProduct(Long productId,HttpSession session);												//更新 產品 改成上架狀態 (查資料庫同時 也驗證了身分)
	void minusProductByid(Long id ,Integer integer);													//依 productId -quantity 
	List<SellerProductResponse>  getSellerProduct (Long userId);												//依賣家id 取 商品 轉  SellerProductResponse
	SellerProductResponse findProductByIdToSellerProductDto(Long productId,HttpSession session);				//依 productId 找 產品轉SellerProductResponse	  更新 產品用 (查資料庫同時 也驗證了身分 其實不用 但我想共用一樣的方法)
	ProductResponse findProductByIdToProductResponse(Long id);											//依 productId 找 產品轉DTO  				  產品卡用
	List<ProductResponse> findAllProductsToProductResponse();											//找全部			 產品轉DTO  				  分類頁面用
	List<ProductResponse> findAllProductsByCategorySlugToProductResponses(String slug);					//依 slug(分類別稱)找分類(含子分類)下的所有產品 轉DTO  分類頁面用     
//	List<ProductResponse> findByKeyword(String keyword); 	 	
	List<ProductResponse> findProductsByKeywordFullTextBooleanToProductResponses(String keyword);		//全文搜尋版 找相關產品轉DTO			  收尋頁面用
	
	
}

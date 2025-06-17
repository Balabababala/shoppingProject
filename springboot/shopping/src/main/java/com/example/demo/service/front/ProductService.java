package com.example.demo.service.front;

import java.util.List;

import com.example.demo.model.dto.AdminProductCreateRequest;
import com.example.demo.model.dto.AdminProductResponse;
import com.example.demo.model.dto.ProductResponse;
import com.example.demo.model.dto.SellerProductCreateRequest;
import com.example.demo.model.dto.SellerProductResponse;


import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;



public interface ProductService {
	
	
	//邏輯
	//賣家
	void addProduct(SellerProductCreateRequest sellerProductDto,HttpSession session);					//新增 產品 
	void updateProduct(SellerProductCreateRequest sellerProductDto ,Long productId,HttpSession session);//更新 產品
	void deleteProduct(Long productId,HttpSession session);												//更新 產品 改成刪除狀態 (查資料庫同時 也驗證了身分)
	void unActiveProduct(Long productId,HttpSession session);											//更新 產品 改成下架狀態 (查資料庫同時 也驗證了身分)
	void activeProduct(Long productId,HttpSession session);												//更新 產品 改成上架狀態 (查資料庫同時 也驗證了身分)
	List<SellerProductResponse>  getSellerProduct (Long userId);										//依賣家id 取 商品 轉  SellerProductResponse
	
	//買家 一般使用者
	void minusProductByid(Long id ,Integer integer);													//依 productId -quantity 
	SellerProductResponse findProductByIdToSellerProductDto(Long productId,HttpSession session);		//依 productId 找 產品轉SellerProductResponse	  更新 產品用 (查資料庫同時 也驗證了身分 其實不用 但我想共用一樣的方法)
	ProductResponse findProductByIdToProductResponse(Long id);											//依 productId 找 產品轉DTO  				  產品卡用
	List<ProductResponse> findAllProductsToProductResponse();											//找全部			 產品轉DTO  				  分類頁面用
	List<ProductResponse> findAllProductsByCategorySlugToProductResponses(String slug);					//依 slug(分類別稱)找分類(含子分類)下的所有產品 轉DTO  分類頁面用     
//	List<ProductResponse> findByKeyword(String keyword); 	 	
	List<ProductResponse> findProductsByKeywordFullTextBooleanToProductResponses(String keyword);		//全文搜尋版 找相關產品轉DTO			  收尋頁面用
	
	//後台
	 // 取得後台所有商品列表
    List<AdminProductResponse> getAllProductsForAdmin();
    // 後台新增商品
    void addProductByAdmin(@Valid AdminProductCreateRequest request);
    // 後台刪除商品（軟刪除）
    void deleteProductByAdmin(Long id);
    // 後台回復商品（取消軟刪除）
    void restoreProductByAdmin(Long id);
    // 後台商品下架（狀態改為非上架）
    void unActiveProductByAdmin(Long id);
    // 後台商品下架（狀態改為非上架）
    void activeProductByAdmin(Long id);
    
    // 後台取得單一商品詳細資訊
    AdminProductResponse findProductByIdForAdmin(Long id);
	void updateProductByAdmin(Long id, @Valid AdminProductCreateRequest request);
}

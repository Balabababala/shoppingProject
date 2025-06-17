package com.example.demo.service.front;

import java.util.List;

import com.example.demo.model.dto.ProductReviewDto;


public interface ProductReviewService {

		ProductReviewDto addReview(Long userId, Long productId, int rating, String comment); //新增評論
	    List<ProductReviewDto> getReviewsByProduct(Long productId);							 //該商品的可見評論列表
	    List<ProductReviewDto> getReviewsByUser(Long userId);								 //該使用者的評論列表
	    
	    
	    													 
	    
	    //後臺用
	    ProductReviewDto updateVisibility(Long reviewId, boolean visible);					 //後台顯示/隱藏評論
	    ProductReviewDto approveReview(Long reviewId, boolean approved);					 //審核評論通過與否
	    void deleteReview(Long reviewId);													 //刪除評論
	    List<ProductReviewDto> getAllReviews();												 //取得全部評論（含隱藏、未審核）
	
}

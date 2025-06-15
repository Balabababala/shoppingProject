package com.example.demo.service;

import java.util.List;

import com.example.demo.model.dto.ProductReviewDto;


public interface ProductReviewService {

		ProductReviewDto addReview(Long userId, Long productId, int rating, String comment);

	    List<ProductReviewDto> getReviewsByProduct(Long productId);

	    List<ProductReviewDto> getReviewsByUser(Long userId);

	    ProductReviewDto updateVisibility(Long reviewId, boolean visible);

	    ProductReviewDto approveReview(Long reviewId, boolean approved);

	    void deleteReview(Long reviewId);
	
}

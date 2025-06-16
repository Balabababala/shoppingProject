package com.example.demo.mapper;


import com.example.demo.model.dto.ProductReviewDto;
import com.example.demo.model.entity.ProductReview;

public class ProductReviewMapper {

	
	public static ProductReviewDto toDto(ProductReview review) {
	    if (review == null) return null;

	    ProductReviewDto dto = new ProductReviewDto();
	    dto.setId(review.getId());
	    dto.setUserId(review.getUser() != null ? review.getUser().getId() : null);
	    dto.setProductId(review.getProduct() != null ? review.getProduct().getId() : null);
	    dto.setRating(review.getRating());
	    dto.setComment(review.getComment());
	    dto.setCreatedAt(review.getCreatedAt());
	    dto.setUpdatedAt(review.getUpdatedAt());
	    dto.setIsVisible(review.getIsVisible());
	    dto.setIsApproved(review.getIsApproved());

	    return dto;
	}


    // DTO -> Entity (可選，視需求用)
    public static ProductReview toEntity(ProductReviewDto dto) {
        if (dto == null) return null;

        ProductReview review = new ProductReview();
        review.setId(dto.getId());
        // user 和 product 需另外在 service 層設定 Entity
        review.setRating(dto.getRating());
        review.setComment(dto.getComment());
        review.setCreatedAt(dto.getCreatedAt());
        review.setUpdatedAt(dto.getUpdatedAt());
        review.setIsVisible(dto.getIsVisible());
        review.setIsApproved(dto.getIsApproved());
        return review;
    }
}

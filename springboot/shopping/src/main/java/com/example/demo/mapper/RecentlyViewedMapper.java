package com.example.demo.mapper;

import com.example.demo.model.dto.RecentlyViewedResponse;
import com.example.demo.model.entity.Product;
import com.example.demo.model.entity.RecentlyViewed;

public class RecentlyViewedMapper {

    public static RecentlyViewedResponse toDto(RecentlyViewed recentlyViewed) {
        if (recentlyViewed == null) {
            return null;
        }
        
        String imageUrl=null;
        if (recentlyViewed.getProduct() != null 
                && recentlyViewed.getProduct().getProductImages() != null 
                && !recentlyViewed.getProduct().getProductImages().isEmpty()) {
                imageUrl = recentlyViewed.getProduct().getProductImages().get(0).getImageUrl();
            }
        
 
        return new RecentlyViewedResponse(
        	    recentlyViewed.getProduct() != null ? recentlyViewed.getProduct().getId() : null,
        	    recentlyViewed.getProduct() != null ? recentlyViewed.getProduct().getName() : null,
        	    imageUrl,
        	    recentlyViewed.getViewedAt()
        	);
    }
}

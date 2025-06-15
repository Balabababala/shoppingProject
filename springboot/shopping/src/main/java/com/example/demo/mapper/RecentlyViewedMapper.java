package com.example.demo.mapper;

import com.example.demo.model.dto.RecentlyViewedResponse;
import com.example.demo.model.entity.Product;
import com.example.demo.model.entity.RecentlyViewed;

public class RecentlyViewedMapper {

    public static RecentlyViewedResponse toDto(RecentlyViewed recentlyViewed) {
    	RecentlyViewedResponse recentlyViewedResponse =new RecentlyViewedResponse();
    	Product product =recentlyViewed.getProduct();
    	if(product==null) {
    		return null;
    	}
    	recentlyViewedResponse.setProductId(product.getId());
    	recentlyViewedResponse.setProductName(product.getName());
    	if(product.getProductImages()!=null) {
    		recentlyViewedResponse.setProductImageDtos(
    				product.getProductImages().stream()
    										  .map(ProductImageMapper::toDto)
    										  .toList());
    	}
        recentlyViewedResponse.setViewedAt(recentlyViewed.getViewedAt());
        return recentlyViewedResponse;
        
       
        
 
        
    }
}

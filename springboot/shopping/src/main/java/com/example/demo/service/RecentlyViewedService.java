package com.example.demo.service;

import java.util.List;
import java.util.Optional;

import com.example.demo.model.dto.RecentlyViewedResponse;
import com.example.demo.model.entity.RecentlyViewed;

public interface RecentlyViewedService {
	//repository
	
	void add(RecentlyViewed recentlyViewed);
	
	Optional<RecentlyViewed> findByUserIdAndProductId(Long userId,Long productId);
	
	List<RecentlyViewed> findByUserIdOrderByViewTimeDescWithUserAndproductAndproductImage(Long userId);
	
	//邏輯
	void addRecentlyViewed(Long userId ,Long productId);				  //新增最近看過 包到點產品controller
	
	List<RecentlyViewedResponse> getRecentlyViewedByUserId(Long userId);  //取最近看過
	
}

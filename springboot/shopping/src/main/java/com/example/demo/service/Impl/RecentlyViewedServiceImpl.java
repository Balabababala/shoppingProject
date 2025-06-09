package com.example.demo.service.Impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.exception.ShoppingException;
import com.example.demo.mapper.RecentlyViewedMapper;
import com.example.demo.model.dto.RecentlyViewedResponse;
import com.example.demo.model.entity.RecentlyViewed;
import com.example.demo.repository.RecentlyViewedRepository;
import com.example.demo.service.ProductService;
import com.example.demo.service.RecentlyViewedService;
import com.example.demo.service.UserService;

@Service
public class RecentlyViewedServiceImpl implements RecentlyViewedService{
	
	@Autowired
	private RecentlyViewedRepository  recentlyViewedRepository;
	
	@Autowired
	private UserService userService;
	
	@Autowired
	private ProductService productService;
	
	 //repository
	@Override
	public void add(RecentlyViewed recentlyViewed) {
		recentlyViewedRepository.save(recentlyViewed);
	}
	
	public Optional<RecentlyViewed> findByUserIdAndProductId(Long userId,Long productId){
		return recentlyViewedRepository.findByUserIdAndProductId(userId,productId);
	}
	
	public List<RecentlyViewed> findByUserIdOrderByViewTimeDescWithUserAndproductAndproductImage(Long userId){
		return recentlyViewedRepository.findByUserIdOrderByViewTimeDescWithUserAndproductAndproductImage(userId);
	};
	
	
	
	//邏輯
	
	
	
	public List<RecentlyViewedResponse> getRecentlyViewedByUserId(Long userId){ 		//取最近看過
		return findByUserIdOrderByViewTimeDescWithUserAndproductAndproductImage(userId).stream()
																				.map(RecentlyViewedMapper::toDto)
																				.toList();
	}

	@Override
	public void addRecentlyViewed(Long userId, Long productId) {
		Optional<RecentlyViewed> opt = findByUserIdAndProductId(userId, productId);
		if(opt.isPresent()) {								//已存在 只更新時間
			RecentlyViewed recentlyViewed = opt.get();
			recentlyViewed.setViewedAt(LocalDateTime.now());
			add(recentlyViewed);
			return;
		}
		
		RecentlyViewed recentlyViewed =new RecentlyViewed();	
		recentlyViewed.setProduct(productService.findById(productId)
												.orElseThrow(() -> new ShoppingException("Product not found with id " + productId)));
		recentlyViewed.setUser(userService.findById(userId)
				 						  .orElseThrow(() -> new ShoppingException("User not found with id " + userId)));
		recentlyViewed.setViewedAt(LocalDateTime.now());
		add(recentlyViewed);
	}
	
}

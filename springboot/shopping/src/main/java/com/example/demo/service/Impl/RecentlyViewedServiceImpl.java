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
import com.example.demo.repository.ProductRepository;
import com.example.demo.repository.RecentlyViewedRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.ProductService;
import com.example.demo.service.RecentlyViewedService;
import com.example.demo.service.UserService;

@Service
public class RecentlyViewedServiceImpl implements RecentlyViewedService{
	
	@Autowired
	private RecentlyViewedRepository  recentlyViewedRepository;
	
	@Autowired
	private UserRepository userRepository;
	
	@Autowired
	private ProductRepository productRepository;
	
	
	//邏輯
	
	
	
	public List<RecentlyViewedResponse> getRecentlyViewedByUserId(Long userId){ 		//取最近看過
		return recentlyViewedRepository.findByUserIdOrderByViewTimeDescWithUserAndproductAndproductImage(userId).stream()
																				.map(RecentlyViewedMapper::toDto)
																				.toList();
	}

	@Override
	public void addRecentlyViewed(Long userId, Long productId) {
		Optional<RecentlyViewed> opt = recentlyViewedRepository.findByUserIdAndProductId(userId, productId);
		if(opt.isPresent()) {								//已存在 只更新時間
			RecentlyViewed recentlyViewed = opt.get();
			recentlyViewed.setViewedAt(LocalDateTime.now());
			recentlyViewedRepository.save(recentlyViewed);
			return;
		}
		
		RecentlyViewed recentlyViewed =new RecentlyViewed();	
		recentlyViewed.setProduct(productRepository.findById(productId)
												.orElseThrow(() -> new ShoppingException("Product not found with id " + productId)));
		recentlyViewed.setUser(userRepository.findById(userId)
				 						  .orElseThrow(() -> new ShoppingException("User not found with id " + userId)));
		recentlyViewed.setViewedAt(LocalDateTime.now());
		recentlyViewedRepository.save(recentlyViewed);
	}
	
}
